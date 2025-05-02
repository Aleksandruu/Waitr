import { createSlice } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../../helpers/reduxReducerGenerator";
import { ProductOrderRequest } from "shared/models/order.request.model";
export interface OrderState {
  table: number;
  locationId: string;
  orderTime: Date | undefined;
  comments: string;
  products: ProductOrderRequest[];
}

const initialState: OrderState = {
  table: 0,
  locationId: "",
  orderTime: undefined,
  comments: "",
  products: [],
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // ...generateSetterReducers<OrderState>(initialState),
    addProductToOrder: (state, action) => {
      const { productId } = action.payload;
      state.products.push({ id: productId, quantity: 1 });
      console.log(productId);
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
    },
  },
});

export const orderActions = orderSlice.actions;

export default orderSlice.reducer;
