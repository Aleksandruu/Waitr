import type { Meta, StoryObj } from "@storybook/react";
import Admin from "./Admin";
import * as LocationStories from "./locationCard/LocationCard.stories";

const locations = [
  {
    location: "The Restaurant",
    id: 123,
    name: "Alexandru",
  },
];

const meta = {
  title: "Admin/Admin Page",
  component: Admin,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: { ...LocationStories.LocationCardStory },
} satisfies Meta<typeof Admin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const AdminStory: Story = {
  args: { locations },
};
