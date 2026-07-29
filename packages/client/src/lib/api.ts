import type {
  AppSettings,
  CreateTaskInput,
  MoveTaskInput,
  Task,
  ThemeSettings,
  UpdateTaskInput,
} from "@kanban/shared";

// Empty string = same-origin (Next.js rewrites proxy /api to the Fastify server).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getTasks: () => request<Task[]>("/api/tasks"),
  createTask: (input: CreateTaskInput) =>
    request<Task>("/api/tasks", { method: "POST", body: JSON.stringify(input) }),
  updateTask: (id: string, input: UpdateTaskInput) =>
    request<Task>(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(input) }),
  moveTask: (id: string, input: MoveTaskInput) =>
    request<Task>(`/api/tasks/${id}/move`, { method: "POST", body: JSON.stringify(input) }),
  deleteTask: (id: string) => request<void>(`/api/tasks/${id}`, { method: "DELETE" }),
  getSettings: () => request<AppSettings>("/api/settings"),
  saveSettings: (theme: ThemeSettings) =>
    request<AppSettings>("/api/settings", {
      method: "PUT",
      body: JSON.stringify({ theme }),
    }),
};
