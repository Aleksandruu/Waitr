import type { Meta, StoryObj } from "@storybook/react";
import CreateListInput from "./CreateListInput";

const meta = {
  title: "Components/CreateListInput",
  component: CreateListInput,
  tags: ["autodocs"],
} satisfies Meta<typeof CreateListInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
