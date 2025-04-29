import type { Meta, StoryObj } from "@storybook/react";
import LocationSettings from "./LocationSettings";

const meta = {
  title: "Components/LocationSettings",
  component: LocationSettings,
  tags: ["autodocs"],
} satisfies Meta<typeof LocationSettings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
