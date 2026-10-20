#!/usr/bin/env bash
# Durcit SSH : connexion par clé uniquement (plus de mot de passe) + fail2ban.
# À lancer UNIQUEMENT après avoir vérifié que VOTRE clé fonctionne, depuis votre PC :
#   ssh -o PasswordAuthentication=no root@62.171.184.248 "echo CLE_OK"     (doit afficher CLE_OK sans demander de mot de passe)
# Puis, en root sur le serveur :
#   curl -fsSL https://raw.githubusercontent.com/aubinfranck-hub/BEBETAB/claude/loving-gauss-qr7v33/vps-deploy/harden-ssh.sh | bash
# Coolify se connecte avec sa propre clé : il continue de fonctionner.
set -euo pipefail

main() {
  [ "$(id -u)" -eq 0 ] || { echo "Lancez ce script en root." >&2; exit 1; }
  AK=/root/.ssh/authorized_keys
  n=$(grep -E '^(ssh|ecdsa|sk-)' "$AK" 2>/dev/null | tr -d '\r' | grep -vic coolify || true)
  if [ "${n:-0}" -lt 1 ] && [ "${FORCE:-0}" != "1" ]; then
    echo "REFUS : aucune clé personnelle (hors Coolify) dans $AK : vous seriez enfermé dehors." >&2
    exit 1
  fi

  mkdir -p /etc/ssh/sshd_config.d
  cp -a /etc/ssh/sshd_config.d "/root/sshd_config.d.bak-$(date +%s)"
  # Préfixe 00- : sshd garde la PREMIÈRE valeur lue, donc ce fichier passe avant 50-cloud-init.conf.
  cat > /etc/ssh/sshd_config.d/00-hardening.conf <<'EOF'
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
EOF
  if ! sshd -t; then
    rm -f /etc/ssh/sshd_config.d/00-hardening.conf
    echo "Configuration SSH invalide : annulé, rien n'a changé." >&2
    exit 1
  fi
  systemctl reload ssh 2>/dev/null || systemctl reload sshd

  echo "Réglages SSH effectifs :"
  sshd -T | grep -E '^(passwordauthentication|kbdinteractiveauthentication|permitrootlogin) '

  DEBIAN_FRONTEND=noninteractive apt-get install -y fail2ban </dev/null >/dev/null
  systemctl enable --now fail2ban >/dev/null 2>&1 || true
  echo "fail2ban : $(systemctl is-active fail2ban)"
  echo
  echo "TERMINÉ. Gardez cette fenêtre ouverte et testez dans une AUTRE fenêtre : ssh root@$(curl -4 -fsS --max-time 5 https://ifconfig.me 2>/dev/null || echo IP_DU_SERVEUR)"
  echo "Retour arrière si besoin : rm /etc/ssh/sshd_config.d/00-hardening.conf && systemctl reload ssh"
}

main "$@"
