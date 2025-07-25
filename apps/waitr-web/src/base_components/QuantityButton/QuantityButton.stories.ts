import type { Meta, StoryObj } from "@storybook/react";
import QuantityButton from "./QuantityButton";

const meta = {
  title: "Components/AddToCartButton",
  component: QuantityButton,
  tags: ["autodocs"],
} satisfies Meta<typeof QuantityButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    quantity: 0,
    onClick: () => {},
    onDecrement: () => {},
    onIncrement: () => {},
    text: "Add to cart",
  },
};
