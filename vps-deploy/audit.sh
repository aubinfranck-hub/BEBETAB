#!/usr/bin/env bash
# Audit du VPS — LECTURE SEULE : ne modifie rien (écrit seulement le rapport dans /root).
# En root sur le serveur :
#   curl -fsSL https://raw.githubusercontent.com/aubinfranck-hub/BEBETAB/claude/loving-gauss-qr7v33/vps-deploy/audit.sh | bash
# Aucun secret n'est affiché : ni contenu des .env, ni mots de passe, ni clés privées.

main() {
  N_OK=0; N_WARN=0; N_CRIT=0
  ok()   { printf '  [OK]         %s\n' "$*"; N_OK=$((N_OK+1)); }
  warn() { printf '  [ATTENTION]  %s\n' "$*"; N_WARN=$((N_WARN+1)); }
  crit() { printf '  [CRITIQUE]   %s\n' "$*"; N_CRIT=$((N_CRIT+1)); }
  info() { printf '               %s\n' "$*"; }
  sec()  { printf '\n=== %s ===\n' "$*"; }
  have() { command -v "$1" >/dev/null 2>&1; }

  if [ "$(id -u)" -ne 0 ]; then echo "Lancez ce script en root." >&2; exit 1; fi
  OUT="/root/audit-vps-$(date +%Y%m%d-%H%M%S).txt"
  exec > >(tee "$OUT") 2>&1
  echo "AUDIT VPS — $(date '+%F %T %Z') — $(hostname) — lecture seule"

  # ---------------------------------------------------------------- 1. Système
  sec "1. Système"
  # shellcheck disable=SC1091
  . /etc/os-release 2>/dev/null || true
  info "OS: ${PRETTY_NAME:-?} | noyau $(uname -r) | $(uptime -p 2>/dev/null)"
  info "CPU: $(nproc) | RAM utilisée: $(free -h | awk '/^Mem:/{print $3 "/" $2}') | swap: $(free -h | awk '/^Swap:/{print $3 "/" $2}')"
  d=$(df --output=pcent / | tail -1 | tr -dc '0-9')
  if [ "${d:-0}" -ge 90 ]; then crit "Disque / plein à ${d}%"
  elif [ "${d:-0}" -ge 75 ]; then warn "Disque / à ${d}%"
  else ok "Disque / à ${d}%"; fi
  if [ -f /var/run/reboot-required ]; then warn "Redémarrage requis (mise à jour système en attente)"; else ok "Aucun redémarrage en attente"; fi
  if have apt-get; then
    sim="$(apt-get -s upgrade 2>/dev/null | grep '^Inst' || true)"
    n=$(printf '%s\n' "$sim" | grep -c . || true)
    s=$(printf '%s\n' "$sim" | grep -ci security || true)
    if [ "${s:-0}" -gt 0 ]; then warn "${s} mise(s) à jour de sécurité en attente (${n} paquets au total, d'après la dernière liste apt)"
    elif [ "${n:-0}" -gt 0 ]; then warn "${n} mise(s) à jour en attente (aucune marquée sécurité)"
    else ok "Système à jour (d'après la dernière liste apt)"; fi
  fi
  if systemctl is-enabled unattended-upgrades >/dev/null 2>&1; then ok "Mises à jour de sécurité automatiques activées"
  else warn "Mises à jour de sécurité automatiques non activées (unattended-upgrades)"; fi
  if [ "$(timedatectl show -p NTPSynchronized --value 2>/dev/null)" = "yes" ]; then ok "Horloge synchronisée"; else warn "Horloge non synchronisée (NTP)"; fi

  # ---------------------------------------------------------------- 2. SSH
  sec "2. Accès SSH"
  ssh_port=22
  if have sshd; then
    cfg="$(sshd -T 2>/dev/null)"
    g() { awk -v k="$1" 'tolower($1)==k{print $2; exit}' <<<"$cfg"; }
    prl="$(g permitrootlogin)"; pwa="$(g passwordauthentication)"; ssh_port="$(g port)"; ssh_port="${ssh_port:-22}"
    info "Port: ${ssh_port} | PermitRootLogin: ${prl:-?} | PasswordAuthentication: ${pwa:-?}"
    if [ "$pwa" = "yes" ] && [ "$prl" = "yes" ]; then crit "Connexion root par MOT DE PASSE active : cible n°1 des attaques par force brute"
    elif [ "$pwa" = "yes" ]; then warn "Connexion SSH par mot de passe active : préférez les clés SSH"
    else ok "Connexion SSH par mot de passe désactivée"; fi
  else
    warn "sshd introuvable (SSH non installé ou accès autre)"
  fi
  if [ -s /root/.ssh/authorized_keys ]; then
    k=$(grep -cE '^(ssh|ecdsa|sk-)' /root/.ssh/authorized_keys || true)
    info "Clés SSH autorisées pour root: ${k} (commentaires: $(grep -E '^(ssh|ecdsa|sk-)' /root/.ssh/authorized_keys | tr -d '\r' | awk '{print $NF}' | tr '\n' ' '))"
    warn "Vérifiez que vous reconnaissez chacune de ces clés"
  else
    info "Aucune clé SSH pour root"
  fi
  logs="$( (journalctl -u ssh.service -u sshd.service --since '24 hours ago' --no-pager 2>/dev/null; cat /var/log/auth.log 2>/dev/null) )"
  f=$(printf '%s\n' "$logs" | grep -cE 'Failed password|Invalid user' || true)
  info "Tentatives de connexion échouées (24 h): ${f}"
  if [ "${f:-0}" -gt 0 ]; then
    info "Principales IP: $(printf '%s\n' "$logs" | grep -E 'Failed password|Invalid user' | grep -oE 'from [0-9a-fA-F.:]+' | awk '{print $2}' | sort | uniq -c | sort -rn | head -3 | awk '{print $2 " (" $1 ")"}' | tr '\n' ' ')"
  fi
  if [ "${f:-0}" -ge 50 ] && [ "$pwa" = "yes" ]; then crit "Attaque par force brute en cours (${f} tentatives en 24 h) alors que le mot de passe est accepté"
  elif [ "${f:-0}" -ge 50 ]; then warn "Nombreuses tentatives de connexion (${f}/24 h), bloquées car le mot de passe est refusé"; fi
  if systemctl is-active --quiet fail2ban 2>/dev/null; then ok "fail2ban actif"; else warn "fail2ban absent ou inactif"; fi
  info "Dernières connexions réussies (vérifiez les IP):"
  last -a -n 6 2>/dev/null | head -6 | while IFS= read -r l; do info "$l"; done

  # ---------------------------------------------------------------- 3. Pare-feu et ports
  sec "3. Pare-feu et ports ouverts"
  if have ufw; then
    st="$(ufw status 2>/dev/null | head -1)"
    case "$st" in
      *inactive*) warn "ufw installé mais INACTIF" ;;
      *active*)   ok "ufw actif" ;;
      *)          warn "état de ufw inconnu: $st" ;;
    esac
    ufw status 2>/dev/null | tail -n +4 | head -20 | while IFS= read -r l; do [ -n "$l" ] && info "$l"; done
  else
    warn "ufw non installé"
  fi
  info "Le pare-feu externe de Contabo (panneau client) ne peut pas être vu depuis le serveur."
  info "Docker contourne ufw : tout port publié par un conteneur est public même si ufw le bloque."
  declare -A seen
  while read -r proto local proc; do
    addr="${local%:*}"; port="${local##*:}"
    case "$addr" in 127.*|'[::1]'|::1|'127.0.0.53%lo'|'127.0.0.54') continue ;; esac
    key="$proto/$port"
    [ -n "${seen[$key]:-}" ] && continue
    seen[$key]=1
    pname="$(sed -E 's/.*\("([^"]+)".*/\1/' <<<"$proc")"
    if [ "$port" = "$ssh_port" ]; then info "public: $key (SSH)"; continue; fi
    case "$port" in
      80|443|21115|21116|21117|21118|21119) info "public: $key (${pname:-?})" ;;
      8000) warn "Port $key ouvert (${pname:-?}) : si c'est l'interface Coolify, elle est en HTTP clair et donne le contrôle du serveur : à mettre derrière un nom de domaine HTTPS + double authentification" ;;
      6001|6002) info "public: $key (${pname:-?}) : temps réel Coolify (normal si Coolify est installé)" ;;
      8080) warn "Port $key ouvert (${pname:-?}) : souvent le tableau de bord Traefik du proxy Coolify, à fermer s'il est accessible sans mot de passe" ;;
      5432|3306|6379|27017|9200|11211|2375|3000|4000|5000) crit "Port $key exposé à Internet (${pname:-?}) : ne devrait pas l'être" ;;
      *) warn "Port inattendu ouvert à Internet: $key (${pname:-?})" ;;
    esac
  done < <(ss -H -tulnp 2>/dev/null | awk '{print $1, $5, $7}')

  # ---------------------------------------------------------------- 4. Docker
  sec "4. Docker"
  if have docker && docker info >/dev/null 2>&1; then
    info "Docker $(docker version --format '{{.Server.Version}}' 2>/dev/null)"
    docker ps --format 'conteneur: {{.Names}} | {{.Image}} | {{.Status}}' 2>/dev/null | while IFS= read -r l; do info "$l"; done
    bad="$( (docker ps --filter health=unhealthy --format '{{.Names}}'; docker ps --filter status=restarting --format '{{.Names}}') 2>/dev/null | sort -u | tr '\n' ' ')"
    if [ -n "$bad" ]; then crit "Conteneurs en échec: $bad"; else ok "Aucun conteneur en échec ou en redémarrage"; fi
    ex="$(docker ps -a --filter status=exited --format '{{.Names}}' 2>/dev/null | tr '\n' ' ')"
    if [ -n "$ex" ]; then warn "Conteneurs arrêtés: $ex"; fi
    unp="$(docker ps --format '{{.Names}}={{.Image}}' 2>/dev/null | grep -E '=[^:]+$|:latest$' | tr '\n' ' ')"
    if [ -n "$unp" ]; then warn "Images non épinglées (':latest') : une mise à jour imprévue est possible: $unp"; fi
    priv="$(docker ps -q 2>/dev/null | xargs -r docker inspect --format '{{.Name}} {{.HostConfig.Privileged}}' 2>/dev/null | awk '$2=="true"{print $1}' | grep -v 'buildx_buildkit' | tr '\n' ' ')"
    if [ -n "$priv" ]; then crit "Conteneurs en mode privilégié: $priv"; else ok "Aucun conteneur privilégié"; fi
    if grep -q 'max-size' /etc/docker/daemon.json 2>/dev/null; then ok "Rotation des journaux Docker configurée"
    else warn "Pas de rotation des journaux Docker (/etc/docker/daemon.json) : risque de disque plein à terme"; fi
    info "Espace Docker: $(docker system df --format '{{.Type}} {{.Size}}' 2>/dev/null | tr '\n' ';')"
  else
    warn "Docker absent ou inaccessible"
  fi

  # ---------------------------------------------------------------- 5. RustDesk
  sec "5. RustDesk (hbbs / hbbr)"
  if have docker && docker inspect hbbs >/dev/null 2>&1; then
    for c in hbbs hbbr; do
      if docker inspect "$c" >/dev/null 2>&1; then
        s="$(docker inspect -f '{{.State.Status}}' "$c")"; rc="$(docker inspect -f '{{.RestartCount}}' "$c")"
        if [ "$s" = "running" ]; then ok "$c en marche (redémarrages: $rc)"; else crit "$c n'est pas en marche (état: $s)"; fi
      else
        crit "Conteneur $c introuvable"
      fi
    done
    for p in 21115 21116 21117 21118 21119; do
      ss -tln 2>/dev/null | grep -q ":$p " || warn "Port RustDesk $p/tcp n'écoute pas"
    done
    rd="$(docker inspect hbbs --format '{{range .Mounts}}{{if eq .Destination "/root"}}{{.Source}}{{end}}{{end}}' 2>/dev/null)"
    if [ -n "$rd" ] && [ -s "$rd/id_ed25519" ]; then
      m="$(stat -c %a "$rd/id_ed25519")"
      info "Dossier de données: $rd"
      if [ "$m" = "600" ] || [ "$m" = "400" ]; then ok "Clé privée RustDesk présente (permissions $m)"; else warn "Clé privée RustDesk lisible par d'autres (permissions $m, devrait être 600)"; fi
      copies="$(find /opt /root /home /srv /mnt /var/backups -xdev \( -name 'id_ed25519' -o -name 'id_ed25519.pub' \) \( -path '*rustdesk*' -o -path '*backup*' \) -not -path "$rd/*" 2>/dev/null | head -3)"
      if [ -z "$copies" ]; then warn "Aucune copie de la clé RustDesk détectée : si le serveur est perdu, TOUS les clients devront être reconfigurés. Copiez $rd/id_ed25519* hors du serveur."
      else ok "Copie de la clé RustDesk détectée"; fi
    else
      warn "Clé RustDesk introuvable (dossier de données non trouvé via le conteneur hbbs)"
    fi
  else
    info "Conteneur RustDesk 'hbbs' non trouvé sur ce serveur."
  fi

  # ---------------------------------------------------------------- 6. TECH-ASSIST / SkinDiag
  sec "6. TECH-ASSIST et SkinDiag (/opt/stack)"
  if [ -f /opt/stack/docker-compose.yml ]; then
    cd /opt/stack || true
    for f in .env tech-assist.env skindiag.env; do
      if [ -f "$f" ]; then
        m="$(stat -c %a "$f")"
        if [ "$m" = "600" ]; then ok "$f : permissions 600"; else warn "$f : permissions $m (devrait être 600)"; fi
      fi
    done
    for f in tech-assist.env skindiag.env; do
      if [ -f "$f" ]; then
        n=$(grep -cvE '^\s*(#|$)' "$f" || true)
        if [ "${n:-0}" -eq 0 ]; then warn "$f est vide : variables de Render (Jeko, Gemini...) pas encore copiées"; else ok "$f : ${n} variable(s) définie(s)"; fi
      fi
    done
    docker compose ps --format '{{.Service}}: {{.State}} {{.Health}}' 2>/dev/null | while IFS= read -r l; do info "service $l"; done
    TH="$(grep -E '^TECH_HOST=' .env 2>/dev/null | cut -d= -f2-)"; SH="$(grep -E '^SKIN_HOST=' .env 2>/dev/null | cut -d= -f2-)"
    if [ -n "$TH" ]; then
      code="$(curl -sk -m 10 -o /dev/null -w '%{http_code}' --resolve "$TH:443:127.0.0.1" "https://$TH/api/health" 2>/dev/null)"
      if [ "$code" = "200" ]; then ok "TECH-ASSIST répond (https://$TH/api/health -> 200)"; else warn "TECH-ASSIST ne répond pas correctement (code ${code:-aucun})"; fi
      cert="$(openssl s_client -connect 127.0.0.1:443 -servername "$TH" </dev/null 2>/dev/null | openssl x509 -noout -issuer -enddate 2>/dev/null | tr '\n' ' ')"
      if [ -n "$cert" ]; then info "Certificat $TH: $cert"; else warn "Aucun certificat HTTPS servi pour $TH (Let's Encrypt a-t-il réussi ? docker compose logs caddy)"; fi
    fi
    if [ -n "$SH" ]; then
      code="$(curl -sk -m 10 -o /dev/null -w '%{http_code}' --resolve "$SH:443:127.0.0.1" "https://$SH/" 2>/dev/null)"
      if [ "$code" = "200" ]; then ok "SkinDiag répond (https://$SH/ -> 200)"; else warn "SkinDiag ne répond pas correctement (code ${code:-aucun})"; fi
    fi
  else
    info "Pas de /opt/stack : TECH-ASSIST et SkinDiag ne sont pas (encore) déployés ici."
  fi

  # ---------------------------------------------------------------- 7. Sauvegardes
  sec "7. Sauvegardes"
  lastb="$(ls -1t /opt/stack/backup 2>/dev/null | head -1)"
  cr="$( (crontab -l 2>/dev/null; cat /etc/cron.d/* 2>/dev/null) | grep -vE '^\s*#' | grep -ciE 'pg_dump|pgbackrest|restic|borg|rclone|duplicity|backup' || true)"
  if [ -n "$lastb" ]; then info "Dernier dump manuel: $lastb"; fi
  if [ "${cr:-0}" -gt 0 ]; then ok "Tâche de sauvegarde planifiée détectée"; else warn "Aucune sauvegarde automatique détectée (bases Postgres, clé RustDesk). Un disque perdu = tout perdu."; fi
  info "Contabo propose des snapshots dans le panneau client (à vérifier là-bas)."

  # ---------------------------------------------------------------- 8. Comptes et indices de compromission
  sec "8. Comptes et indices de compromission"
  u0="$(awk -F: '$3==0 && $1!="root"{print $1}' /etc/passwd | tr '\n' ' ')"
  if [ -n "$u0" ]; then crit "Autre(s) compte(s) avec les droits root (UID 0): $u0"; else ok "Seul root a l'UID 0"; fi
  ep="$(awk -F: '($2==""){print $1}' /etc/shadow 2>/dev/null | tr '\n' ' ')"
  if [ -n "$ep" ]; then crit "Comptes SANS mot de passe: $ep"; else ok "Aucun compte sans mot de passe"; fi
  info "Comptes avec shell de connexion: $(awk -F: '$7 ~ /(bash|sh|zsh)$/ {print $1}' /etc/passwd | tr '\n' ' ')"
  if grep -rqE 'NOPASSWD' /etc/sudoers /etc/sudoers.d 2>/dev/null; then warn "sudo sans mot de passe (NOPASSWD) configuré (courant sur les images cloud : à connaître, surtout si un compte 'ubuntu' existe)"; fi
  if [ -e /etc/ld.so.preload ]; then crit "/etc/ld.so.preload existe (technique classique de rootkit) : à examiner"; else ok "Pas de /etc/ld.so.preload"; fi
  tmpx="$(find /tmp /var/tmp /dev/shm -type f -perm -u+x 2>/dev/null | head -5 | tr '\n' ' ')"
  if [ -n "$tmpx" ]; then warn "Exécutables dans les dossiers temporaires: $tmpx"; else ok "Aucun exécutable dans /tmp, /var/tmp, /dev/shm"; fi
  sus="$( (crontab -l 2>/dev/null; cat /etc/cron.d/* /var/spool/cron/crontabs/* 2>/dev/null) | grep -E 'curl|wget|base64|/dev/tcp|nc ' | grep -v '^#' | head -3)"
  if [ -n "$sus" ]; then warn "Tâches cron téléchargeant/exécutant du code: $sus"; else ok "Aucune tâche cron suspecte"; fi
  miner="$(ps -eo comm 2>/dev/null | grep -iE 'xmrig|kdevtmpfsi|kinsing|minerd|cpuminer|ccminer|xmr-' | sort -u | tr '\n' ' ')"
  if [ -n "$miner" ]; then crit "Processus de type mineur de cryptomonnaie: $miner"; else ok "Aucun processus de type mineur connu"; fi
  info "Processus les plus gourmands en CPU:"
  ps -eo pid,user,pcpu,pmem,comm --sort=-pcpu 2>/dev/null | head -6 | while IFS= read -r l; do info "$l"; done
  info "(Ce sont des indices, pas une preuve : un résultat propre n'exclut pas une compromission.)"

  # ---------------------------------------------------------------- Résumé
  sec "RÉSUMÉ"
  echo "  OK: $N_OK | ATTENTION: $N_WARN | CRITIQUE: $N_CRIT"
  echo "  Rapport enregistré dans: $OUT"
  echo "  Aucun secret n'y figure : vous pouvez le copier-coller tel quel dans la conversation."
  sleep 1
}

main "$@"
