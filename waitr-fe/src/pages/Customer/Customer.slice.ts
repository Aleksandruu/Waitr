import { createSlice } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../../helpers/reduxReducerGenerator";
import { CartItemDto } from "shared";
import { customerApi } from "waitr-fe/src/api/customerApi";

export interface OrderState {
  currentOrder: CartItemDto[];
  orderTime?: Date;
  preferences: string;
  products: CartItemDto[];
  status: "empty" | "products" | "checkout" | "placed";
}

const savedProducts = sessionStorage.getItem("orderProducts");
let parsedProducts: CartItemDto[] = [];

try {
  parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
} catch (e) {
  console.warn("Failed to parse order products from sessionStorage", e);
}

const initialState: OrderState = {
  orderTime: undefined,
  preferences: "",
  products: parsedProducts,
  status: parsedProducts.length ? "products" : "empty",
  currentOrder: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    ...generateSetterReducers<OrderState>(initialState),
    addProductToOrder: (state, action) => {
      const { productId, productName, productPrice } = action.payload;
      state.products.push({
        productId: productId,
        quantity: 1,
        name: productName,
        price: productPrice,
      });
      state.status = "products";
    },
    increaseQuantityForProduct: (state, action) => {
      const { productId } = action.payload;

      const product = state.products.find(
        (product) => product.productId === productId
      );
      if (product) {
        product.quantity += 1;
      }
    },
    decreaseQuantityForProduct: (state, action) => {
      const { productId } = action.payload;
      const product = state.products.find(
        (product) => product.productId === productId
      );
      if (product) {
        product.quantity -= 1;
      }
      if (product?.quantity === 0) {
        state.products = state.products.filter(
          (product) => product.productId !== productId
        );
      }
      if (!state.products.length) {
        state.status = "empty";
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      customerApi.endpoints.getCurrentOrder.matchFulfilled,
      (state, { payload }) => {
        state.currentOrder = payload;
      }
    );
    builder.addMatcher(
      customerApi.endpoints.createOrder.matchFulfilled,
      (state) => {
        state.products = [];
        state.status = "placed";
      }
    );
  },
});

export const orderActions = orderSlice.actions;

export default orderSlice.reducer;
