#!/bin/bash
set -e
cd /var/www/myapp
maxsec=10
echo "*** Wait for database ${DJANGO_DB_TYPE} to be ready (max ${maxsec} seconds)"
for i in $(seq $maxsec); do
  if uv run ./back/manage.py inspectdb >/dev/null 2>&1; then
    dbok=1
    break
  fi
  sleep 1
done
if [ "$dbok" -eq 1 ] && [ -z "$DJANGO_SKIP_MIGRATE" ]; then
  echo "*** Django Check for Deploy"
  uv run ./back/manage.py check --deploy --fail-level WARNING
  echo "*** Django Migrate"
  uv run ./back/manage.py migrate
  export VENV="$PWD/.venv"
  sed -E -i "s|###MAPBOX_PUBLIC_KEY###|${MAPBOX_PUBLIC_KEY}|" back/static/assets/config-*.js
else
  # allow regular error
  uv run ./back/manage.py inspectdb
fi
