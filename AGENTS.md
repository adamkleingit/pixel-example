# Flowboard

Kanban board monorepo: Next.js client, Fastify + TypeORM server, Postgres, and Storybook. See `README.md` for architecture, package layout, scripts, and the API reference.

## Cursor Cloud specific instructions

### Services

- `@kanban/server` (Fastify + TypeORM) on port `3001`; `@kanban/client` (Next.js) on port `3000`. `@kanban/shared` is a source-only package (its `exports` point at `src/`), compiled by a `tsc --watch` during `pnpm dev`.
- Standard commands live in `package.json` / `README.md` (`pnpm dev`, `pnpm build`, `pnpm -r run lint`, `pnpm storybook`). Prefer those.

### Postgres (required, not in the update script)

- The server needs Postgres and connects using `packages/server/.env`. There is no Docker in the cloud VM, so Postgres is installed as a system package (`postgresql` 16) and is NOT reinstalled by the update script.
- Start it and ensure the `kanban` role/db exist before running the server:
  - `sudo pg_ctlcluster 16 main start`
  - Create role/db (idempotent): a `kanban`/`kanban` superuser owning a `kanban` database. `./scripts/setup-db.sh` does this via the `postgres` OS user.
- The server uses TypeORM `synchronize: true` and seeds sample tasks on first boot, so no manual migrations are needed.

### Env files (required, git-ignored, not created by the update script)

- `packages/server/.env` — copy from `.env.example`.
- `packages/client/.env.local` — must contain `NEXT_PUBLIC_API_URL=http://localhost:3001`.

### Gotchas

- `pnpm --filter @kanban/client lint` (`next lint`) is interactive and fails in a non-TTY because no ESLint config is committed. Use `pnpm --filter @kanban/shared lint` and `pnpm --filter @kanban/server lint` (both `tsc --noEmit`) for type checks. Full type validation also runs during `next build`.
