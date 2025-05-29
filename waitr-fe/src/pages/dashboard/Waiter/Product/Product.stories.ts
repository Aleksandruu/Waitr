import type { Meta, StoryObj } from "@storybook/react";
import Product from "./Product";

const meta = {
  title: "Components/Product",
  component: Product,
  tags: ["autodocs"],
} satisfies Meta<typeof Product>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    orderItem: {
      name: "Pizza",
      quantity: 2,
      status: "ready",
      productId: "",
      price: 0,
      orderTime: new Date(),
    },
  },
};
