import type { Meta, StoryObj } from "@storybook/react";
import Payment from "./Payment";

const meta = {
  title: "Components/Payment",
  component: Payment,
  tags: ["autodocs"],
} satisfies Meta<typeof Payment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
