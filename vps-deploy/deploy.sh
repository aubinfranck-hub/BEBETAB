#!/usr/bin/env bash
# Déploie TECH-ASSIST + SkinDiag sur le VPS Contabo, à côté de RustDesk (jamais touché).
# Une seule commande, en root sur le serveur :
#   curl -fsSL https://raw.githubusercontent.com/aubinfranck-hub/BEBETAB/claude/loving-gauss-qr7v33/vps-deploy/deploy.sh | bash
# Réexécutable sans risque : les secrets et les données déjà créés sont conservés.
# Noms de domaine : TECH_HOST=app.exemple.ci SKIN_HOST=skin.exemple.ci bash deploy.sh
set -euo pipefail

main() {
  local BASE_URL="${BASE_URL:-https://raw.githubusercontent.com/aubinfranck-hub/BEBETAB/claude/loving-gauss-qr7v33/vps-deploy}"
  local STACK=/opt/stack
  local TA_BRANCH="${TA_BRANCH:-claude/ecstatic-maxwell-z0gk4g}"   # branche déployée sur Render
  local SK_BRANCH="${SK_BRANCH:-skindiag-main}"                     # branche déployée sur Render
  local RUSTDESK_DATA="${RUSTDESK_DATA:-/opt/rustdesk/data}"

  say() { printf '\n==> %s\n' "$*"; }

  [ "$(id -u)" -eq 0 ] || { echo "Lancez ce script en root." >&2; exit 1; }
  export DEBIAN_FRONTEND=noninteractive

  say "Paquets de base et Docker"
  apt-get update -y </dev/null >/dev/null
  apt-get install -y ca-certificates curl git openssl ufw </dev/null >/dev/null
  if ! command -v docker >/dev/null 2>&1; then
    curl -fsSL https://get.docker.com | sh </dev/null
  fi
  systemctl enable --now docker >/dev/null 2>&1 || true
  docker compose version >/dev/null 2>&1 || { echo "Docker Compose v2 introuvable." >&2; exit 1; }

  say "Vérification des ports 80/443 (pour ne rien casser)"
  local p
  for p in 80 443; do
    if ss -ltn "sport = :$p" | grep -q LISTEN; then
      if ! docker ps --format '{{.Names}}' | grep -qx 'stack-caddy-1'; then
        echo "Le port $p est déjà utilisé par autre chose : arrêt." >&2
        ss -ltnp "sport = :$p" >&2 || true
        exit 1
      fi
    fi
  done

  # RustDesk : on ne le touche pas, on lit seulement sa clé publique pour l'API Tech Assist.
  if docker inspect hbbs >/dev/null 2>&1; then
    local src
    src="$(docker inspect hbbs --format '{{range .Mounts}}{{if eq .Destination "/root"}}{{.Source}}{{end}}{{end}}' 2>/dev/null || true)"
    if [ -n "$src" ]; then RUSTDESK_DATA="$src"; fi
    echo "RustDesk détecté (conteneur hbbs) : laissé tel quel."
  else
    echo "Conteneur RustDesk 'hbbs' non trouvé : la clé sera lue dans $RUSTDESK_DATA si elle existe."
  fi

  say "Fichiers de déploiement dans $STACK"
  mkdir -p "$STACK"
  cd "$STACK"
  local f
  for f in docker-compose.yml Caddyfile restore-data.sh; do
    curl -fsSL "$BASE_URL/$f" -o "$f"
  done
  chmod +x restore-data.sh

  # Reprend les valeurs existantes (idempotent) ; une variable passée en ligne de commande l'emporte.
  local _TH="${TECH_HOST:-}" _SH="${SKIN_HOST:-}"
  if [ -f .env ]; then set -a; . ./.env; set +a; fi
  PUBLIC_IP="${PUBLIC_IP:-$(curl -4 -fsS --max-time 10 https://ifconfig.me 2>/dev/null || echo 62.171.184.248)}"
  local DASHED="${PUBLIC_IP//./-}"
  TECH_HOST="${_TH:-${TECH_HOST:-tech.${DASHED}.sslip.io}}"
  SKIN_HOST="${_SH:-${SKIN_HOST:-skin.${DASHED}.sslip.io}}"
  TA_DB_PASSWORD="${TA_DB_PASSWORD:-$(openssl rand -hex 24)}"
  SK_DB_PASSWORD="${SK_DB_PASSWORD:-$(openssl rand -hex 24)}"
  JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
  SESSION_SECRETS_KEY="${SESSION_SECRETS_KEY:-$(openssl rand -base64 32)}"

  RUSTDESK_PUBLIC_KEY=""
  if [ -s "$RUSTDESK_DATA/id_ed25519.pub" ]; then
    RUSTDESK_PUBLIC_KEY="$(tr -d '\r\n' < "$RUSTDESK_DATA/id_ed25519.pub")"
  fi

  (
    umask 077
    cat > .env <<EOF
PUBLIC_IP=$PUBLIC_IP
TECH_HOST=$TECH_HOST
SKIN_HOST=$SKIN_HOST
TA_DB_PASSWORD=$TA_DB_PASSWORD
SK_DB_PASSWORD=$SK_DB_PASSWORD
JWT_SECRET=$JWT_SECRET
SESSION_SECRETS_KEY=$SESSION_SECRETS_KEY
RUSTDESK_PUBLIC_KEY=$RUSTDESK_PUBLIC_KEY
EOF
  )

  say "Certificat SSL (auto-signé) pour la base SkinDiag"
  mkdir -p certs/sk-db
  if [ ! -s certs/sk-db/server.key ]; then
    openssl req -x509 -nodes -newkey rsa:2048 -days 3650 -subj "/CN=sk-db" \
      -keyout certs/sk-db/server.key -out certs/sk-db/server.crt 2>/dev/null
  fi
  chown 999:999 certs/sk-db/server.key certs/sk-db/server.crt
  chmod 600 certs/sk-db/server.key
  chmod 644 certs/sk-db/server.crt
  chmod 755 certs certs/sk-db

  say "Code source (mêmes branches que sur Render)"
  sync_repo() {   # url branche dossier
    if [ -d "$3/.git" ]; then
      git -C "$3" fetch -q --depth 1 origin "$2"
      git -C "$3" checkout -q -B "$2" FETCH_HEAD
    else
      git clone -q --depth 1 -b "$2" "$1" "$3"
    fi
  }
  sync_repo https://github.com/aubinfranck-hub/TECH-ASSIST.git "$TA_BRANCH" "$STACK/tech-assist"
  sync_repo https://github.com/aubinfranck-hub/skindiag-production.git "$SK_BRANCH" "$STACK/skindiag"

  if [ ! -f tech-assist.env ]; then
    cat > tech-assist.env <<'EOF'
# Variables supplémentaires de l'API Tech Assist : copiez-les depuis Render > tech-assist-api > Environment
# (une par ligne, NOM=valeur). Exemples : JEKO_API_KEY, JEKO_API_KEY_ID, JEKO_STORE_ID, JEKO_WEBHOOK_SECRET,
# GEMINI_API_KEY, DEEPSEEK_API_KEY...  Ne PAS mettre DATABASE_URL, JWT_SECRET, SESSION_SECRETS_KEY (déjà gérés).
EOF
  fi
  if [ ! -f skindiag.env ]; then
    cat > skindiag.env <<'EOF'
# Variables de SkinDiag : copiez-les depuis Render > skindiag-production > Environment (NOM=valeur).
# Exemples : GEMINI_API_KEY, JEKO_API_KEY, JEKO_API_KEY_ID, JEKO_STORE_ID, JEKO_WEBHOOK_SECRET,
# ADMIN_SECRET, ADMIN_SEED_PASSWORD, ADMIN_SEED_PHONE, WAVE_MERCHANT_URL, AI_COST_INPUT_PER_M_FCFA...
# Ne PAS mettre DATABASE_URL, APP_URL, PORT (déjà gérés).
EOF
  fi
  chmod 600 tech-assist.env skindiag.env

  # Ouvre seulement 80/443 ; ne change jamais l'état du pare-feu (SSH et RustDesk restent comme ils sont).
  ufw allow 80/tcp >/dev/null 2>&1 || true
  ufw allow 443/tcp >/dev/null 2>&1 || true
  ufw allow 443/udp >/dev/null 2>&1 || true

  say "Construction et démarrage (quelques minutes)"
  docker compose up -d --build </dev/null

  say "Vérification"
  local i ok_ta=0 ok_sk=0
  for i in $(seq 1 24); do
    if [ "$ok_ta" -eq 0 ] && docker compose exec -T ta-api node -e "fetch('http://localhost:4000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" </dev/null >/dev/null 2>&1; then ok_ta=1; fi
    if [ "$ok_sk" -eq 0 ] && docker compose exec -T sk-app node -e "fetch('http://localhost:3000/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))" </dev/null >/dev/null 2>&1; then ok_sk=1; fi
    if [ "$ok_ta" -eq 1 ] && [ "$ok_sk" -eq 1 ]; then break; fi
    sleep 5
  done
  docker compose ps </dev/null

  echo
  echo "=============================================================="
  [ "$ok_ta" -eq 1 ] && echo "TECH-ASSIST : OK  -> https://$TECH_HOST" || echo "TECH-ASSIST : PAS PRÊT -> docker compose -f $STACK/docker-compose.yml logs ta-api"
  [ "$ok_sk" -eq 1 ] && echo "SkinDiag    : OK  -> https://$SKIN_HOST" || echo "SkinDiag    : PAS PRÊT -> docker compose -f $STACK/docker-compose.yml logs sk-app"
  if [ -n "$RUSTDESK_PUBLIC_KEY" ]; then
    echo "RustDesk    : clé publique lue et transmise à l'API."
  else
    echo "RustDesk    : clé publique introuvable (l'API utilisera le réseau public RustDesk). Dites-moi où est son dossier data."
  fi
  echo "=============================================================="
  echo "Suite : 1) remplir $STACK/tech-assist.env et $STACK/skindiag.env avec les variables de Render"
  echo "        2) cd $STACK && docker compose up -d"
  echo "        3) reprendre les données : voir $STACK/restore-data.sh"
  echo "Render n'a pas été touché : tout y tourne encore."
}

main "$@"
