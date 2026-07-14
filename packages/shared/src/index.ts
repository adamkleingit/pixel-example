export const COLUMNS = ["todo", "doing", "to_review", "done"] as const;

export type ColumnId = (typeof COLUMNS)[number];

export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: "Todo",
  doing: "Doing",
  to_review: "To Review",
  done: "Done",
};

export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnId;
  tags: string[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  column?: ColumnId;
  tags?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  column?: ColumnId;
  tags?: string[];
  position?: number;
}

export interface MoveTaskInput {
  column: ColumnId;
  position: number;
}

export interface ThemeSettings {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: number;
}

export interface AppSettings {
  id: string;
  theme: ThemeSettings;
  updatedAt: string;
}

export const DEFAULT_THEME: ThemeSettings = {
  primaryColor: "#0F766E",
  accentColor: "#F97316",
  backgroundColor: "#F0F7F6",
  surfaceColor: "#FFFFFF",
  textColor: "#134E4A",
  fontFamily: "Figtree",
  borderRadius: 12,
};

export const FONT_OPTIONS = [
  "Figtree",
  "Bricolage Grotesque",
  "Source Sans 3",
  "IBM Plex Sans",
  "Literata",
] as const;
