"use client";

import React, { useEffect, useState } from "react";
import { COLUMNS, COLUMN_LABELS, type ColumnId, type Task } from "@kanban/shared";

export interface TaskFormValues {
  title: string;
  description: string;
  column: ColumnId;
  tags: string[];
}

interface TaskModalProps {
  open: boolean;
  mode: "create" | "edit";
  initial?: Task | null;
  defaultColumn?: ColumnId;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
}

export function TaskModal({
  open,
  mode,
  initial,
  defaultColumn = "todo",
  onClose,
  onSubmit,
}: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<ColumnId>(defaultColumn);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(initial?.title ?? "");
    setDescription(initial?.description ?? "");
    setColumn(initial?.column ?? defaultColumn);
    setTagsInput(initial?.tags.join(", ") ?? "");
    setError(null);
  }, [open, initial, defaultColumn]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const tags = tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
      await onSubmit({ title: title.trim(), description, column, tags });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="task-modal-title">{mode === "create" ? "New task" : "Edit task"}</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="What needs doing?"
              autoFocus
            />
          </div>
          <div className="field">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Optional details"
            />
          </div>
          <div className="field">
            <label htmlFor="task-column">Column</label>
            <select
              id="task-column"
              value={column}
              onChange={(event) => setColumn(event.target.value as ColumnId)}
            >
              {COLUMNS.map((id) => (
                <option key={id} value={id}>
                  {COLUMN_LABELS[id]}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="task-tags">Tags</label>
            <input
              id="task-tags"
              value={tagsInput}
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="Comma-separated, e.g. design, api"
            />
          </div>
          {error ? <div className="status-banner error-banner">{error}</div> : null}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Saving…" : mode === "create" ? "Create" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
