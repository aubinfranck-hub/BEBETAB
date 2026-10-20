#!/usr/bin/env bash
# Reprend les données de Render vers le VPS. À lancer sur le serveur, en root.
#
#   TA_SRC='<External Database URL de ntic-shared-db>'  \
#   SK_SRC='<External Database URL de skindiag-db>'     \
#   bash /opt/stack/restore-data.sh
#
# Les deux sont optionnelles (vous pouvez faire l'une puis l'autre).
# Les URL sont dans Render > la base > Connections > "External Database URL".
# SkinDiag : sa base Render n'accepte aucune IP par défaut -> ajoutez d'abord l'IP du VPS
# (62.171.184.248/32) dans Render > skindiag-db > Networking > Inbound IP Rules.
# Une sauvegarde SQL est conservée dans /opt/stack/backup avant toute restauration.
set -euo pipefail
cd /opt/stack
mkdir -p backup
stamp="$(date +%Y%m%d-%H%M%S)"

if [ -z "${TA_SRC:-}" ] && [ -z "${SK_SRC:-}" ]; then
  echo "Rien à faire : définissez TA_SRC et/ou SK_SRC (voir l'en-tête du script)." >&2
  exit 1
fi

if [ -n "${TA_SRC:-}" ]; then
  echo "==> TECH-ASSIST : sauvegarde depuis Render"
  docker run --rm postgres:18-alpine pg_dump "$TA_SRC" --schema=tech_assist --no-owner --no-privileges \
    > "backup/tech-assist-$stamp.sql"
  [ -s "backup/tech-assist-$stamp.sql" ] || { echo "Dump vide, arrêt (rien n'a été modifié)." >&2; exit 1; }
  echo "==> TECH-ASSIST : restauration"
  docker compose stop ta-api
  docker compose exec -T ta-db psql -U techassist -d techassist -v ON_ERROR_STOP=1 -q \
    -c 'DROP SCHEMA IF EXISTS tech_assist CASCADE'
  docker compose exec -T ta-db psql -U techassist -d techassist -v ON_ERROR_STOP=1 -q \
    < "backup/tech-assist-$stamp.sql"
  docker compose start ta-api
  echo "TECH-ASSIST : données reprises."
fi

if [ -n "${SK_SRC:-}" ]; then
  echo "==> SkinDiag : sauvegarde depuis Render"
  if ! docker run --rm postgres:16-alpine pg_dump "$SK_SRC" --no-owner --no-privileges --clean --if-exists \
      > "backup/skindiag-$stamp.sql"; then
    echo "Connexion refusée ? Ajoutez 62.171.184.248/32 dans Render > skindiag-db > Networking." >&2
    exit 1
  fi
  [ -s "backup/skindiag-$stamp.sql" ] || { echo "Dump vide, arrêt (rien n'a été modifié)." >&2; exit 1; }
  echo "==> SkinDiag : restauration"
  docker compose stop sk-app
  docker compose exec -T sk-db psql -U skindiag -d skindiag -v ON_ERROR_STOP=1 -q \
    < "backup/skindiag-$stamp.sql"
  docker compose start sk-app
  echo "SkinDiag : données reprises."
fi

echo "Terminé. Sauvegardes : /opt/stack/backup"
