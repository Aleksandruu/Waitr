import { Middleware } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const persistOrderProducts: Middleware<{}, RootState> =
  (store) => (next) => (action) => {
    const result = next(action);

    const state = store.getState();
    const products = state.order.products;

    try {
      // Guard for native (no sessionStorage)
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("orderProducts", JSON.stringify(products));
      }
    } catch (e) {
      // On native we silently ignore persistence errors
    }

    return result;
  };
