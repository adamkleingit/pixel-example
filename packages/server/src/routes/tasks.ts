import type { FastifyInstance } from "fastify";
import { COLUMNS, type ColumnId, type CreateTaskInput, type MoveTaskInput, type UpdateTaskInput } from "@kanban/shared";
import { AppDataSource } from "../data-source";
import { TaskEntity } from "../entities/Task";

function serializeTask(task: TaskEntity) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    column: task.column,
    tags: task.tags ?? [],
    position: task.position,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

function isColumnId(value: unknown): value is ColumnId {
  return typeof value === "string" && (COLUMNS as readonly string[]).includes(value);
}

export async function taskRoutes(app: FastifyInstance) {
  const repo = () => AppDataSource.getRepository(TaskEntity);

  app.get("/api/tasks", async () => {
    const tasks = await repo().find({ order: { position: "ASC", createdAt: "ASC" } });
    return tasks.map(serializeTask);
  });

  app.get<{ Params: { id: string } }>("/api/tasks/:id", async (request, reply) => {
    const task = await repo().findOneBy({ id: request.params.id });
    if (!task) {
      return reply.code(404).send({ error: "Task not found" });
    }
    return serializeTask(task);
  });

  app.post<{ Body: CreateTaskInput }>("/api/tasks", async (request, reply) => {
    const { title, description = "", column = "todo", tags = [] } = request.body ?? {};

    if (!title || typeof title !== "string" || !title.trim()) {
      return reply.code(400).send({ error: "Title is required" });
    }
    if (!isColumnId(column)) {
      return reply.code(400).send({ error: "Invalid column" });
    }

    const maxPosition = await repo()
      .createQueryBuilder("task")
      .select("MAX(task.position)", "max")
      .where("task.column = :column", { column })
      .getRawOne<{ max: number | null }>();

    const task = repo().create({
      title: title.trim(),
      description: typeof description === "string" ? description : "",
      column,
      tags: Array.isArray(tags) ? tags.map(String).filter(Boolean) : [],
      position: (maxPosition?.max ?? -1) + 1,
    });

    const saved = await repo().save(task);
    return reply.code(201).send(serializeTask(saved));
  });

  app.patch<{ Params: { id: string }; Body: UpdateTaskInput }>(
    "/api/tasks/:id",
    async (request, reply) => {
      const task = await repo().findOneBy({ id: request.params.id });
      if (!task) {
        return reply.code(404).send({ error: "Task not found" });
      }

      const { title, description, column, tags, position } = request.body ?? {};

      if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
          return reply.code(400).send({ error: "Title cannot be empty" });
        }
        task.title = title.trim();
      }
      if (description !== undefined) {
        task.description = typeof description === "string" ? description : "";
      }
      if (column !== undefined) {
        if (!isColumnId(column)) {
          return reply.code(400).send({ error: "Invalid column" });
        }
        task.column = column;
      }
      if (tags !== undefined) {
        task.tags = Array.isArray(tags) ? tags.map(String).filter(Boolean) : [];
      }
      if (position !== undefined) {
        if (typeof position !== "number" || Number.isNaN(position)) {
          return reply.code(400).send({ error: "Invalid position" });
        }
        task.position = position;
      }

      const saved = await repo().save(task);
      return serializeTask(saved);
    },
  );

  app.post<{ Params: { id: string }; Body: MoveTaskInput }>(
    "/api/tasks/:id/move",
    async (request, reply) => {
      const task = await repo().findOneBy({ id: request.params.id });
      if (!task) {
        return reply.code(404).send({ error: "Task not found" });
      }

      const { column, position } = request.body ?? {};
      if (!isColumnId(column) || typeof position !== "number") {
        return reply.code(400).send({ error: "column and position are required" });
      }

      const sourceColumn = task.column;
      const targetColumn = column;

      await AppDataSource.transaction(async (manager) => {
        const taskRepo = manager.getRepository(TaskEntity);

        // Close gap in source column
        await taskRepo
          .createQueryBuilder()
          .update(TaskEntity)
          .set({ position: () => '"position" - 1' })
          .where("column = :column", { column: sourceColumn })
          .andWhere("position > :position", { position: task.position })
          .andWhere("id != :id", { id: task.id })
          .execute();

        // Make room in target column
        await taskRepo
          .createQueryBuilder()
          .update(TaskEntity)
          .set({ position: () => '"position" + 1' })
          .where("column = :column", { column: targetColumn })
          .andWhere("position >= :position", { position })
          .andWhere("id != :id", { id: task.id })
          .execute();

        task.column = targetColumn;
        task.position = position;
        await taskRepo.save(task);
      });

      const updated = await repo().findOneByOrFail({ id: task.id });
      return serializeTask(updated);
    },
  );

  app.delete<{ Params: { id: string } }>("/api/tasks/:id", async (request, reply) => {
    const task = await repo().findOneBy({ id: request.params.id });
    if (!task) {
      return reply.code(404).send({ error: "Task not found" });
    }

    await AppDataSource.transaction(async (manager) => {
      const taskRepo = manager.getRepository(TaskEntity);
      await taskRepo.remove(task);
      await taskRepo
        .createQueryBuilder()
        .update(TaskEntity)
        .set({ position: () => '"position" - 1' })
        .where("column = :column", { column: task.column })
        .andWhere("position > :position", { position: task.position })
        .execute();
    });

    return reply.code(204).send();
  });
}
