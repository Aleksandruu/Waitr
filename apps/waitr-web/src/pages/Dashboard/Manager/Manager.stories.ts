import type { Meta, StoryObj } from "@storybook/react";
import Manager from "./Manager";

const meta = {
  title: "Components/Manager",
  component: Manager,
  tags: ["autodocs"],
} satisfies Meta<typeof Manager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
