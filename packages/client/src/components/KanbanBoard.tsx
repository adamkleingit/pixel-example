"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { COLUMNS, type ColumnId, type Task } from "@kanban/shared";
import { api } from "@/lib/api";
import { BoardColumn } from "./BoardColumn";
import { TaskCard } from "./TaskCard";
import { TaskModal, type TaskFormValues } from "./TaskModal";

function groupByColumn(tasks: Task[]): Record<ColumnId, Task[]> {
  const groups = Object.fromEntries(COLUMNS.map((id) => [id, [] as Task[]])) as Record<
    ColumnId,
    Task[]
  >;
  for (const task of [...tasks].sort((a, b) => a.position - b.position)) {
    groups[task.column].push(task);
  }
  return groups;
}

function findColumn(tasks: Task[], id: string): ColumnId | null {
  if ((COLUMNS as readonly string[]).includes(id)) {
    return id as ColumnId;
  }
  return tasks.find((task) => task.id === id)?.column ?? null;
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const columns = useMemo(() => groupByColumn(tasks), [tasks]);

  function openCreate() {
    setEditingTask(null);
    setModalOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setModalOpen(true);
  }

  async function handleSubmit(values: TaskFormValues) {
    if (editingTask) {
      const updated = await api.updateTask(editingTask.id, values);
      setTasks((prev) => prev.map((task) => (task.id === updated.id ? updated : task)));
    } else {
      const created = await api.createTask(values);
      setTasks((prev) => [...prev, created]);
    }
  }

  async function handleDelete(task: Task) {
    if (!window.confirm(`Remove “${task.title}”?`)) return;
    await api.deleteTask(task.id);
    setTasks((prev) => {
      const remaining = prev.filter((item) => item.id !== task.id);
      return remaining.map((item) =>
        item.column === task.column && item.position > task.position
          ? { ...item, position: item.position - 1 }
          : item,
      );
    });
  }

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((item) => item.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);
    const activeColumn = findColumn(tasks, activeId);
    const overColumn = findColumn(tasks, overId);

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setTasks((prev) => {
      const activeIndex = prev.findIndex((task) => task.id === activeId);
      if (activeIndex < 0) return prev;

      const moving = { ...prev[activeIndex], column: overColumn };
      const without = prev.filter((task) => task.id !== activeId);
      const overTasks = without.filter((task) => task.column === overColumn);
      const overIndex = overTasks.findIndex((task) => task.id === overId);
      const insertAt = overIndex >= 0 ? overIndex : overTasks.length;

      const nextOver = [...overTasks];
      nextOver.splice(insertAt, 0, moving);

      const other = without.filter((task) => task.column !== overColumn);
      const normalizedOver = nextOver.map((task, index) => ({ ...task, position: index }));
      const normalizedSource = other
        .filter((task) => task.column === activeColumn)
        .map((task, index) => ({ ...task, position: index }));
      const rest = other.filter((task) => task.column !== activeColumn);

      return [...rest, ...normalizedSource, ...normalizedOver];
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    let nextTasks = tasks;
    const activeColumn = findColumn(tasks, activeId);
    const overColumn = findColumn(tasks, overId);
    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      const columnTasks = tasks
        .filter((task) => task.column === activeColumn)
        .sort((a, b) => a.position - b.position);
      const oldIndex = columnTasks.findIndex((task) => task.id === activeId);
      const newIndex = columnTasks.findIndex((task) => task.id === overId);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) {
        // dropped on column container
        if (overId === activeColumn) {
          const position = columnTasks.length - 1;
          const current = columnTasks[oldIndex];
          if (current && current.position !== position) {
            nextTasks = tasks.map((task) =>
              task.column === activeColumn
                ? {
                    ...task,
                    position:
                      task.id === activeId
                        ? position
                        : task.position > current.position
                          ? task.position - 1
                          : task.position,
                  }
                : task,
            );
            setTasks(nextTasks);
          } else {
            return;
          }
        } else {
          return;
        }
      } else {
        const reordered = arrayMove(columnTasks, oldIndex, newIndex).map((task, index) => ({
          ...task,
          position: index,
        }));
        nextTasks = [
          ...tasks.filter((task) => task.column !== activeColumn),
          ...reordered,
        ];
        setTasks(nextTasks);
      }
    }

    const moved = nextTasks.find((task) => task.id === activeId);
    if (!moved) return;

    try {
      await api.moveTask(moved.id, { column: moved.column, position: moved.position });
      const fresh = await api.getTasks();
      setTasks(fresh);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to move task");
      await load();
    }
  }

  if (loading) {
    return <div className="status-banner">Loading board…</div>;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Board</h1>
          <p>Drag cards between Todo, In Progress, To Review, and Done.</p>
        </div>
        <button type="button" className="btn" onClick={openCreate}>
          New task
        </button>
      </div>

      {error ? <div className="status-banner error-banner">{error}</div> : null}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board">
          {COLUMNS.map((columnId) => (
            <BoardColumn
              key={columnId}
              columnId={columnId}
              tasks={columns[columnId]}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              onEdit={() => undefined}
              onDelete={() => undefined}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        open={modalOpen}
        mode={editingTask ? "edit" : "create"}
        initial={editingTask}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
