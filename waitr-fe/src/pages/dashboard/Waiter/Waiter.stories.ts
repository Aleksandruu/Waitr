import type { Meta, StoryObj } from "@storybook/react";
import Waiter from "./Waiter";

const meta = {
  title: "Components/Waiter",
  component: Waiter,
  tags: ["autodocs"],
} satisfies Meta<typeof Waiter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
