import type { Meta, StoryObj } from "@storybook/react";
import CreateStaff from "./CreateStaff";

const meta = {
  title: "Components/CreateStaff",
  component: CreateStaff,
  tags: ["autodocs"],
} satisfies Meta<typeof CreateStaff>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
