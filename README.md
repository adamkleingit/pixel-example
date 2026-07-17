# Flowboard

Example Kanban board monorepo with a Next.js client, Fastify + TypeORM server, Postgres persistence, and Storybook.

## Packages

| Package | Path | Stack |
| --- | --- | --- |
| `@kanban/shared` | `packages/shared` | Shared types + column constants |
| `@kanban/server` | `packages/server` | Fastify, TypeORM, Postgres |
| `@kanban/client` | `packages/client` | Next.js App Router, dnd-kit, Storybook |

## Features

- Fixed columns: **Todo**, **Doing**, **To Review**, **Done**
- Create, edit, tag, and remove tasks
- Drag tasks between columns (order persisted on the server)
- Settings page for theme tokens (colors, font, radius) saved in Postgres

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io) 10+
- Postgres 16 (Docker Compose included, or a local instance)

## Database

### Docker

```bash
pnpm db:up
```

This starts Postgres on `localhost:5432` with:

- user / password / database: `kanban` / `kanban` / `kanban`

### Local Postgres

If Docker is unavailable, use the helper script (requires a local Postgres service):

```bash
./scripts/setup-db.sh
```

Then copy env files:

```bash
cp .env.example packages/server/.env
# Client only needs the public API URL:
echo 'NEXT_PUBLIC_API_URL=http://localhost:3001' > packages/client/.env.local
```

## Develop

```bash
pnpm install
pnpm --filter @kanban/shared build
pnpm dev
```

- Client: http://localhost:3000
- API: http://localhost:3001
- Health: http://localhost:3001/api/health

### Storybook

```bash
pnpm storybook
```

Storybook runs at http://localhost:6006.

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/tasks` | List tasks |
| `POST` | `/api/tasks` | Create task |
| `PATCH` | `/api/tasks/:id` | Update task |
| `POST` | `/api/tasks/:id/move` | Move / reorder task |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `GET` | `/api/settings` | Get theme settings |
| `PUT` | `/api/settings` | Save theme settings |

## Scripts

- `pnpm dev` — run shared watcher, server, and client
- `pnpm build` — build all packages
- `pnpm storybook` — component workshop
- `pnpm db:up` / `pnpm db:down` — manage Postgres via Compose
