import type { Meta, StoryObj } from "@storybook/react";
import Admin from "./Admin";
import { LocationResponseDto } from "types";

const locations: LocationResponseDto[] = [
  {
    id: "123",
    slug: "The Restaurant",
    name: "Alexandru",
  },
];

const meta = {
  title: "Dashboard/Admin/Admin Page",
  component: Admin,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: { data: [] },
} satisfies Meta<typeof Admin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminStory: Story = {
  args: { data: locations },
};
