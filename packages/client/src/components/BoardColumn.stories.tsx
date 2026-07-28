import React, { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Task } from "@kanban/shared";
import { BoardColumn } from "./BoardColumn";

const initialTasks: Task[] = [
  {
    id: "c1",
    title: "Draft acceptance criteria",
    description: "Capture the happy path and edge cases.",
    column: "todo",
    tags: ["product"],
    position: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "c2",
    title: "Prepare sample data",
    description: "",
    column: "todo",
    tags: ["data"],
    position: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ColumnHost({
  initialTasks: seedTasks = initialTasks,
  ...props
}: Omit<ComponentProps<typeof BoardColumn>, "tasks" | "onEdit" | "onDelete"> & {
  initialTasks?: Task[];
}) {
  const [tasks, setTasks] = useState(seedTasks);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  return (
    <DndContext sensors={sensors}>
      <div style={{ maxWidth: 320 }}>
        <BoardColumn
          {...props}
          tasks={tasks}
          onEdit={fn()}
          onDelete={(task) => setTasks((prev) => prev.filter((item) => item.id !== task.id))}
        />
      </div>
    </DndContext>
  );
}

const meta: Meta<typeof ColumnHost> = {
  title: "Board/BoardColumn",
  component: BoardColumn,
  render: (args) => <ColumnHost {...args} />,
  args: {
    columnId: "todo",
  },
};

export default meta;
type Story = StoryObj<typeof ColumnHost>;

export const Populated: Story = {};

export const Empty: Story = {
  args: { initialTasks: [] },
};
