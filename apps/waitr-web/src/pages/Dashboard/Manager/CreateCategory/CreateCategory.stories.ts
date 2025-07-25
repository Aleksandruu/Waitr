import type { Meta, StoryObj } from "@storybook/react";
import CreateCategory from "./CreateCategory";

const meta = {
  title: "Components/CreateCategory",
  component: CreateCategory,
  tags: ["autodocs"],
} satisfies Meta<typeof CreateCategory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
