import { createSlice } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../../helpers/reduxReducerGenerator";
import { CartItemDto } from "shared";
import { customerApi } from "waitr-fe/src/api/customerApi";

export interface OrderState {
  currentOrder: CartItemDto[];
  orderTime?: Date;
  preferences: string;
  products: CartItemDto[];
  status: "empty" | "products" | "checkout" | "placed" | "payment";
  selectedProductsForPayment: CartItemDto[];
  productsForPayment?: CartItemDto[];
  tipAmount: number;
  isLoaded?: boolean;
}

const getParsedProducts = () => {
  const products = sessionStorage.getItem("orderProducts");
  try {
    return products ? JSON.parse(products) : [];
  } catch (e) {
    console.warn("Failed to parse order products from sessionStorage", e);
  }
};

const initialState: OrderState = {
  orderTime: undefined,
  preferences: "",
  products: getParsedProducts(),
  status: getParsedProducts().length ? "products" : "empty",
  currentOrder: [],
  selectedProductsForPayment: [],
  productsForPayment: [],
  tipAmount: 0,
  isLoaded: false,
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
    // New reducers for payment using CartItemDto
    addProductToPayment: (state, action) => {
      const { productId } = action.payload;
      // Use productsForPayment instead of currentOrder to only add products that can be paid
      const product = state.productsForPayment?.find(
        (p) => p.productId === productId
      );

      if (
        product &&
        !state.selectedProductsForPayment.some((p) => p.productId === productId)
      ) {
        state.selectedProductsForPayment.push({
          productId: product.productId,
          quantity: 1,
          name: product.name,
          price: product.price,
        });
      }
    },
    incrementProductForPayment: (state, action) => {
      const { productId } = action.payload;
      const selectedProduct = state.selectedProductsForPayment.find(
        (p) => p.productId === productId
      );
      // Use productsForPayment instead of currentOrder to check against products that can be paid
      const originalProduct = state.productsForPayment?.find(
        (p) => p.productId === productId
      );

      if (
        selectedProduct &&
        originalProduct &&
        selectedProduct.quantity < originalProduct.quantity
      ) {
        selectedProduct.quantity += 1;
      }
    },
    decrementProductForPayment: (state, action) => {
      const { productId } = action.payload;
      const selectedProduct = state.selectedProductsForPayment.find(
        (p) => p.productId === productId
      );

      if (selectedProduct && selectedProduct.quantity > 0) {
        selectedProduct.quantity -= 1;

        if (selectedProduct.quantity === 0) {
          state.selectedProductsForPayment =
            state.selectedProductsForPayment.filter(
              (p) => p.productId !== productId
            );
        }
      }
    },
    selectAllProductsForPayment: (state) => {
      // Use productsForPayment instead of currentOrder to only select products that can be paid
      if (state.productsForPayment && state.productsForPayment.length > 0) {
        state.selectedProductsForPayment = state.productsForPayment.map(
          (product) => ({
            productId: product.productId,
            quantity: product.quantity,
            name: product.name,
            price: product.price,
          })
        );
      }
    },
    clearSelectedProductsForPayment: (state) => {
      state.selectedProductsForPayment = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      customerApi.endpoints.getProducts.matchFulfilled,
      (state, { payload }) => {
        state.isLoaded = true;
      }
    );
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
    builder.addMatcher(
      customerApi.endpoints.getUnpaidOrder.matchFulfilled,
      (state, { payload }) => {
        state.selectedProductsForPayment = payload;
        state.productsForPayment = payload;
      }
    );
  },
});

export const orderActions = orderSlice.actions;

export default orderSlice.reducer;
