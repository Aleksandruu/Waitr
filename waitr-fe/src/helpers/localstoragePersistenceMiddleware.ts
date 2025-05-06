import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const persistOrderProducts: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    const state = store.getState();
    const products = state.order.products;

    try {
      localStorage.setItem("orderProducts", JSON.stringify(products));
    } catch (e) {
      console.error("Error saving products to localStorage:", e);
    }

    return result;
  };
