import type { Meta, StoryObj } from "@storybook/react";
import ImageInput from "./ImageInput";

const meta = {
  title: "Components/ImageInput",
  component: ImageInput,
  tags: ["autodocs"],
} satisfies Meta<typeof ImageInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
