#!/usr/bin/env bash
set -euo pipefail

# Creates a local Postgres role/database when Docker is unavailable.
# Requires a running Postgres instance and sudo access for the postgres OS user.

DB_USER="${DATABASE_USER:-kanban}"
DB_PASSWORD="${DATABASE_PASSWORD:-kanban}"
DB_NAME="${DATABASE_NAME:-kanban}"

if command -v docker >/dev/null 2>&1; then
  echo "Docker found — prefer: pnpm db:up"
fi

sudo service postgresql start || true

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}' SUPERUSER;
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec
SQL

echo "Database ready: ${DB_NAME} (user ${DB_USER})"
