import type { Meta, StoryObj } from "@storybook/react";
import CreateLocation from "./CreateLocation";

const meta = {
  title: "Components/CreateLocation",
  component: CreateLocation,
  tags: ["autodocs"],
} satisfies Meta<typeof CreateLocation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
