#!/usr/bin/env bash
# Copie une base Render vers une base PostgreSQL de Coolify. LECTURE SEULE côté Render (pg_dump).
# Sur le serveur, en root :
#   curl -fsSL https://raw.githubusercontent.com/aubinfranck-hub/BEBETAB/claude/loving-gauss-qr7v33/vps-deploy/copy-db-to-coolify.sh | SRC='<External Database URL de Render>' DST='<nom du conteneur PostgreSQL de Coolify>' bash
# Prérequis : l'IP du VPS (62.171.184.248/32) est autorisée dans Render > la base > Networking.
# La base de destination doit être vide : le script refuse sinon, pour ne rien écraser.
# Aucun identifiant n'est affiché. Une copie SQL est gardée dans /opt/db-copies (permissions 600).
set -euo pipefail

main() {
  : "${SRC:?Définir SRC = External Database URL de la base Render}"
  : "${DST:?Définir DST = nom du conteneur PostgreSQL de Coolify}"
  docker inspect "$DST" >/dev/null 2>&1 || { echo "Conteneur '$DST' introuvable (docker ps pour voir les noms)." >&2; exit 1; }

  # Vérifie d'abord que la destination est vide, avant de lire quoi que ce soit.
  local n
  n="$(echo "select count(*) from information_schema.tables where table_schema not in ('pg_catalog','information_schema')" \
        | docker exec -i "$DST" sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA')"
  if [ "${n:-0}" -gt 0 ]; then
    echo "REFUS : la base de destination contient déjà $n table(s). Rien n'a été modifié." >&2
    exit 1
  fi

  mkdir -p /opt/db-copies
  chmod 700 /opt/db-copies
  local f="/opt/db-copies/dump-$(date +%Y%m%d-%H%M%S).sql"

  echo "==> Lecture de la base Render (lecture seule)"
  if ! docker run --rm postgres:18-alpine pg_dump "$SRC" --no-owner --no-privileges > "$f"; then
    rm -f "$f"
    echo "Connexion à Render refusée ? Vérifiez que 62.171.184.248/32 est autorisé dans Render > la base > Networking." >&2
    exit 1
  fi
  [ -s "$f" ] || { echo "Dump vide : arrêt, rien n'a été modifié." >&2; exit 1; }
  chmod 600 "$f"
  echo "    copie SQL : $f ($(du -h "$f" | cut -f1))"

  echo "==> Restauration dans $DST"
  docker exec -i "$DST" sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=1 -q' < "$f"

  echo "==> Contrôle"
  echo "select schemaname, count(*) as tables from pg_tables where schemaname not in ('pg_catalog','information_schema') group by 1 order by 1" \
    | docker exec -i "$DST" sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
  echo "TERMINÉ. La base Render n'a pas été modifiée."
}

main "$@"
