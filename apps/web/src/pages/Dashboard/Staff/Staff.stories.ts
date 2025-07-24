import type { Meta, StoryObj } from "@storybook/react";
import Staff from "./Staff";

const meta = {
  title: "Components/Staff",
  component: Staff,
  tags: ["autodocs"],
} satisfies Meta<typeof Staff>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
