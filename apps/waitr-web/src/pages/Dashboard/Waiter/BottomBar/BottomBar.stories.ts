import type { Meta, StoryObj } from "@storybook/react";
import BottomBar from "./BottomBar";

const meta = {
  title: "Components/BottomBar",
  component: BottomBar,
  tags: ["autodocs"],
} satisfies Meta<typeof BottomBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
