import type { Meta, StoryObj } from "@storybook/react";
import CreateProduct from "./CreateProduct";

const meta = {
  title: "Components/CreateProduct",
  component: CreateProduct,
  tags: ["autodocs"],
} satisfies Meta<typeof CreateProduct>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
