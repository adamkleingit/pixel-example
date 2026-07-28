"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { COLUMN_LABELS, type ColumnId, type Task } from "@kanban/shared";
import { TaskCard } from "./TaskCard";

interface BoardColumnProps {
  columnId: ColumnId;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function BoardColumn({ columnId, tasks, onEdit, onDelete }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: { type: "column", columnId },
  });

  return (
    <section className="column" data-over={isOver} ref={setNodeRef}>
      <header className="column-header">
        <h2 className="column-title">{COLUMN_LABELS[columnId]}</h2>
        <span className="column-count">{tasks.length}</span>
      </header>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="column-list">
          {tasks.length === 0 ? (
            <div className="empty-column">Drop tasks here</div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </div>
      </SortableContext>
    </section>
  );
}
