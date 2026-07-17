import type { Meta, StoryObj } from "@storybook/react";
import type { Task } from "@kanban/shared";
import { TaskCard } from "./TaskCard";

const sampleTask: Task = {
  id: "story-task-1",
  title: "Polish empty column state",
  description: "Make empty columns feel inviting without adding clutter.",
  column: "doing",
  tags: ["design", "ux"],
  position: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const meta: Meta<typeof TaskCard> = {
  title: "Board/TaskCard",
  component: TaskCard,
  args: {
    task: sampleTask,
    onEdit: () => undefined,
    onDelete: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof TaskCard>;

export const Default: Story = {};

export const WithoutDescription: Story = {
  args: {
    task: { ...sampleTask, description: "", tags: ["api"] },
  },
};

export const ManyTags: Story = {
  args: {
    task: {
      ...sampleTask,
      tags: ["design", "api", "qa", "backend"],
    },
  },
};
