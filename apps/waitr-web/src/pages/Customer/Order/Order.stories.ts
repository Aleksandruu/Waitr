import type { Meta, StoryObj } from "@storybook/react";
import Order from "./Order";

const meta = {
  title: "Components/Order",
  component: Order,
  tags: ["autodocs"],
} satisfies Meta<typeof Order>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
