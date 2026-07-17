import type { Meta, StoryObj } from "@storybook/react";
import { TaskModal } from "./TaskModal";

const meta: Meta<typeof TaskModal> = {
  title: "Board/TaskModal",
  component: TaskModal,
  args: {
    open: true,
    mode: "create",
    onClose: () => undefined,
    onSubmit: async () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof TaskModal>;

export const Create: Story = {};

export const Edit: Story = {
  args: {
    mode: "edit",
    initial: {
      id: "1",
      title: "Review pull request",
      description: "Check drag-and-drop behavior across columns.",
      column: "to_review",
      tags: ["qa", "frontend"],
      position: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
};
