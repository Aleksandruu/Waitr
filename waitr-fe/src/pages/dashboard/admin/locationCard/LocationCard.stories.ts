import type { Meta, StoryObj } from "@storybook/react";
import LocationCard from "./LocationCard";

const location = {
  location: "The Restaurant",
  id: 123,
  name: "Alexandru",
};

const meta = {
  title: "Admin/Location Card",
  component: LocationCard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    location: location,
  },
} satisfies Meta<typeof LocationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LocationCardStory: Story = {
  args: {
    location: location,
  },
};
