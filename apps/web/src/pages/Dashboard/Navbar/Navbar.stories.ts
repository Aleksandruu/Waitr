import type { Meta, StoryObj } from "@storybook/react";
import Navbar from "./Navbar";

const meta = {
  title: "Dashboard/Navbar",
  component: Navbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NavbarStory: Story = {
  args: {},
};
