"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@kanban/shared";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  isOverlay?: boolean;
}

export function TaskCard({ task, onEdit, onDelete, isOverlay }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: { type: "task", task },
      disabled: isOverlay,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dragListeners =
    isOverlay || !listeners
      ? {}
      : {
          ...listeners,
          onPointerDown(event: React.PointerEvent<HTMLElement>) {
            if ((event.target as HTMLElement).closest(".task-actions")) {
              return;
            }
            listeners.onPointerDown?.(event);
          },
        };

  return (
    <article
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      className="task-card"
      data-dragging={isDragging && !isOverlay}
      {...(isOverlay ? {} : { ...attributes, ...dragListeners })}
    >
      <h3 className="task-title">{task.title}</h3>
      {task.description ? (
        <p className="task-description">{task.description}</p>
      ) : null}
      {task.tags.length > 0 ? (
        <div className="tag-row">
          {task.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="task-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(task);
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          Edit
        </button>
        <button
          type="button"
          className="icon-btn danger"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(task);
          }}
          onPointerDown={(event) => event.stopPropagation()}
        >
          Remove
        </button>
      </div>
    </article>
  );
}
