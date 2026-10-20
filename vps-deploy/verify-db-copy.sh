#!/usr/bin/env bash
# Vérifie une copie de base : compare, table par table, le nombre de lignes entre Render (source)
# et la base PostgreSQL de Coolify (destination). LECTURE SEULE des deux côtés, aucune donnée affichée.
# Sur le serveur, en root :
#   curl -fsSL https://raw.githubusercontent.com/aubinfranck-hub/BEBETAB/claude/loving-gauss-qr7v33/vps-deploy/verify-db-copy.sh | SRC='<External Database URL de Render>' DST='<conteneur PostgreSQL de Coolify>' bash
# SRC est facultatif : sans lui, le script affiche seulement le contenu de la destination.
set -uo pipefail

main() {
  : "${DST:?Définir DST = nom du conteneur PostgreSQL de Coolify (docker ps pour le trouver)}"
  docker inspect "$DST" >/dev/null 2>&1 || { echo "Conteneur '$DST' introuvable." >&2; exit 1; }

  local Q
  read -r -d '' Q <<'SQL' || true
select table_schema || '.' || table_name,
       (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', table_schema, table_name), false, true, '')))[1]::text::bigint
from information_schema.tables
where table_type = 'BASE TABLE' and table_schema not in ('pg_catalog', 'information_schema')
order by 1
SQL

  local dst src
  dst="$(printf '%s\n' "$Q" | docker exec -i "$DST" sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -tA -F"|"' 2>&1)" \
    || { echo "Lecture de la destination impossible." >&2; exit 1; }

  if [ -z "${SRC:-}" ]; then
    echo "Destination ($DST) : $(printf '%s\n' "$dst" | grep -c . ) table(s)"
    printf '%s\n' "$dst" | tr '|' '\t'
    echo "(Ajoutez SRC=... pour comparer avec Render.)"
    exit 0
  fi

  src="$(printf '%s\n' "$Q" | docker run --rm -i postgres:18-alpine psql "$SRC" -tA -F'|' 2>&1)" \
    || { echo "Lecture de Render impossible (IP du VPS autorisée dans Render > Networking ? URL correcte ?)." >&2; exit 1; }

  echo "TABLE | VPS (copie) | RENDER (source) | ÉTAT"
  LC_ALL=C join -t'|' -a1 -a2 -e 'ABSENTE' -o 0,1.2,2.2 \
      <(printf '%s\n' "$dst" | LC_ALL=C sort) <(printf '%s\n' "$src" | LC_ALL=C sort) \
    | awk -F'|' '
        { d=$2; s=$3; etat="OK identique"
          if (d=="ABSENTE")      { etat="MANQUANTE sur le VPS"; manq++ }
          else if (s=="ABSENTE") { etat="en plus sur le VPS"; plus++ }
          else if (d==s)         { ok++ }
          else if (d+0 < s+0)    { etat="INCOMPLÈTE (" (s-d) " ligne(s) en moins)"; diff++ }
          else                   { etat="plus de lignes sur le VPS (+" (d-s) ")"; diff++ }
          printf "%s | %s | %s | %s\n", $1, d, s, etat }
        END { printf "\nRÉSUMÉ : %d table(s) identiques, %d différente(s), %d manquante(s) sur le VPS, %d en plus sur le VPS\n", ok, diff, manq, plus
              print "(Render continue de recevoir des données : un petit écart sur une table active est normal. Une table MANQUANTE ou très incomplète est anormale.)" }'
}

main "$@"
