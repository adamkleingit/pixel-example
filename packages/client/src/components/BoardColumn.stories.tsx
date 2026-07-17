import type { ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Task } from "@kanban/shared";
import { BoardColumn } from "./BoardColumn";

const tasks: Task[] = [
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

function ColumnHost(props: ComponentProps<typeof BoardColumn>) {
  const sensors = useSensors(useSensor(PointerSensor));
  return (
    <DndContext sensors={sensors}>
      <div style={{ maxWidth: 320 }}>
        <BoardColumn {...props} />
      </div>
    </DndContext>
  );
}

const meta: Meta<typeof BoardColumn> = {
  title: "Board/BoardColumn",
  component: BoardColumn,
  render: (args) => <ColumnHost {...args} />,
  args: {
    columnId: "todo",
    tasks,
    onEdit: () => undefined,
    onDelete: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof BoardColumn>;

export const Populated: Story = {};

export const Empty: Story = {
  args: { tasks: [] },
};
