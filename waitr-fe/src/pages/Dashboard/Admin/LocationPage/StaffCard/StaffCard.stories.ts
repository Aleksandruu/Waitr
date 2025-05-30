import type { Meta, StoryObj } from "@storybook/react";
import StaffCard from "./StaffCard";

const meta = {
  title: "Admin/Staff Card",
  component: StaffCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {},
} satisfies Meta<typeof StaffCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminStory: Story = {
  args: {},
};
