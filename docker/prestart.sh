#!/bin/bash
set -e
if [ -e /tmp/app.env ]; then
  set -a # enable auto-export
  # shellcheck disable=SC1091
  . /tmp/app.env
  set +a # disable auto-export
fi
quit_db() {
  if [ "${DJANGO_DB_TYPE:-postgresql}" = "postgresql" ]; then
    echo '\q'
  else
    echo '.q'
  fi
}
cd /var/www/myapp
maxsec=10
echo "*** Wait for database ${DJANGO_DB_TYPE} to be ready (max ${maxsec} seconds)"
for i in $(seq $maxsec); do
  if quit_db | uv run ./back/manage.py dbshell 2>/dev/null; then
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
  quit_db | uv run ./back/manage.py dbshell
fi
