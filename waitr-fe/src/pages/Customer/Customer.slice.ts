import { createSlice } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../../helpers/reduxReducerGenerator";
import { OrderItem } from "shared/models/productOrderWithNameAndPrice.model";

export interface OrderState {
  table: number;
  locationId: string;
  orderTime: Date | undefined;
  comments: string;
  products: OrderItem[];
  status: "empty" | "products" | "checkout";
}

const savedProducts = localStorage.getItem("orderProducts");
let parsedProducts: OrderItem[] = [];

try {
  parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
} catch (e) {
  console.warn("Failed to parse order products from localStorage", e);
}

const initialState: OrderState = {
  table: 0,
  locationId: "",
  orderTime: undefined,
  comments: "",
  products: parsedProducts,
  status: parsedProducts.length ? "products" : "empty",
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    ...generateSetterReducers<OrderState>(initialState),
    addProductToOrder: (state, action) => {
      const { productId, productName, productPrice } = action.payload;
      state.products.push({
        id: productId,
        quantity: 1,
        name: productName,
        price: productPrice,
      });
      state.status = "products";
    },
    increaseQuantityForProduct: (state, action) => {
      const { productId } = action.payload;
      const product = state.products.find(
        (product) => product.id === productId
      );
      if (product) {
        product.quantity += 1;
      }
    },
    decreaseQuantityForProduct: (state, action) => {
      const { productId } = action.payload;
      const product = state.products.find(
        (product) => product.id === productId
      );
      if (product) {
        product.quantity -= 1;
      }
      if (product?.quantity === 0) {
        state.products = state.products.filter(
          (product) => product.id !== productId
        );
      }
      if (!state.products.length) {
        state.status = "empty";
      }
    },
  },
});

export const orderActions = orderSlice.actions;

export default orderSlice.reducer;
