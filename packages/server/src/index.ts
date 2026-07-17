import "reflect-metadata";
import { config } from "dotenv";
import { resolve } from "path";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { AppDataSource } from "./data-source";
import { taskRoutes } from "./routes/tasks";
import { settingsRoutes } from "./routes/settings";
import { TaskEntity } from "./entities/Task";
import { SettingsEntity } from "./entities/Settings";
import { DEFAULT_THEME } from "@kanban/shared";

config({ path: resolve(__dirname, "../.env") });

async function seedIfEmpty() {
  const taskRepo = AppDataSource.getRepository(TaskEntity);
  const count = await taskRepo.count();
  if (count > 0) return;

  const samples = [
    {
      title: "Sketch the board layout",
      description: "Define column rhythm and card density for the first pass.",
      column: "todo" as const,
      tags: ["design", "ux"],
      position: 0,
    },
    {
      title: "Wire task API endpoints",
      description: "CRUD + move routes backed by TypeORM.",
      column: "doing" as const,
      tags: ["api", "backend"],
      position: 0,
    },
    {
      title: "Review drag-and-drop feel",
      description: "Check keyboard focus and drop indicators across columns.",
      column: "to_review" as const,
      tags: ["qa"],
      position: 0,
    },
    {
      title: "Ship theme persistence",
      description: "Settings page writes theme tokens to Postgres.",
      column: "done" as const,
      tags: ["settings"],
      position: 0,
    },
  ];

  await taskRepo.save(samples.map((s) => taskRepo.create(s)));

  const settingsRepo = AppDataSource.getRepository(SettingsEntity);
  const existing = await settingsRepo.findOne({ where: {} });
  if (!existing) {
    await settingsRepo.save(settingsRepo.create({ theme: DEFAULT_THEME }));
  }
}

async function main() {
  await AppDataSource.initialize();
  await seedIfEmpty();

  const app = Fastify({ logger: true });

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  });

  app.get("/api/health", async () => ({ ok: true }));

  await app.register(taskRoutes);
  await app.register(settingsRoutes);

  const port = Number(process.env.SERVER_PORT ?? 3001);
  await app.listen({ port, host: "0.0.0.0" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
