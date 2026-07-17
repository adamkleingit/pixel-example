import "reflect-metadata";
import { DataSource } from "typeorm";
import { TaskEntity } from "./entities/Task";
import { SettingsEntity } from "./entities/Settings";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST ?? "127.0.0.1",
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? "kanban",
  password: process.env.DATABASE_PASSWORD ?? "kanban",
  database: process.env.DATABASE_NAME ?? "kanban",
  synchronize: true,
  logging: false,
  entities: [TaskEntity, SettingsEntity],
});
