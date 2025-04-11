import type { StoryObj } from "@storybook/react";
import TextInput from "./TextInput";

const meta = {
  title: "TextInput",
  component: TextInput,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const username: Story = {
  args: {
    label: "Username",
    placeholder: "Enter your username",
    error: false,
    onChange: (e) => {
      console.log(e.target.value);
    },
  },
};
