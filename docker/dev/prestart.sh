#!/bin/sh
set -e
yarn install &
(
  uv sync
  uv run ./back/manage.py migrate || true
) &
wait
