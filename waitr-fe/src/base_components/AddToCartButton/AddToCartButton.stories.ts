import type { Meta, StoryObj } from "@storybook/react";
import AddToCartButton from "./AddToCartButton";

const meta = {
  title: "Components/AddToCartButton",
  component: AddToCartButton,
  tags: ["autodocs"],
} satisfies Meta<typeof AddToCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    quantity: 0,
    onClick: () => {},
    onDecrement: () => {},
    onIncrement: () => {},
  },
};
