import { createSlice } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../../../helpers/reduxReducerGenerator";
import { OrderItemDto, TableStatus } from "shared";
import { waiterApi } from "waitr-fe/src/api/waiterApi";
import { OrderResponseDto } from "shared";
import { mapAndSortTablesByStatus } from "waitr-fe/src/helpers/createTablesStatusArray";

export interface WaiterState {
  selectedTable: number;
  tablesStatus: TableStatus[];
  orders: OrderResponseDto[];
  selectedTableProductsToBePaid: OrderItemDto[];
}

const initialState: WaiterState = {
  selectedTable: 0,
  tablesStatus: [],
  orders: [],
  selectedTableProductsToBePaid: [],
};

export const waiterSlice = createSlice({
  name: "waiter",
  initialState,
  reducers: {
    ...generateSetterReducers<WaiterState>(initialState),
    addProductToSelectedTableProductsToBePaid: (
      state,
      action: { payload: OrderItemDto; type: string }
    ) => {
      state.selectedTableProductsToBePaid.push(action.payload);
    },
    increaseQuantityForSelectedTableProduct: (
      state,
      action: { payload: { productId: string }; type: string }
    ) => {
      const { productId } = action.payload;
      const product = state.selectedTableProductsToBePaid.find(
        (product) => product.id === productId
      );
      if (product) {
        product.quantity += 1;
      }
    },
    decreaseQuantityForSelectedTableProduct: (
      state,
      action: { payload: { productId: string }; type: string }
    ) => {
      const { productId } = action.payload;
      const product = state.selectedTableProductsToBePaid.find(
        (product) => product.id === productId
      );
      if (product) {
        product.quantity -= 1;
      }
      if (product?.quantity === 0) {
        state.selectedTableProductsToBePaid =
          state.selectedTableProductsToBePaid.filter(
            (product) => product.id !== productId
          );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      waiterApi.endpoints.getOrders.matchFulfilled,
      (state, { payload }) => {
        state.orders = [...payload];
        state.tablesStatus = mapAndSortTablesByStatus(payload);
        state.selectedTable = state.tablesStatus[0].tableNumber;
      }
    );
    builder.addMatcher(
      waiterApi.endpoints.getOrder.matchFulfilled,
      (state, { payload }) => {
        const orderIndex = state.orders.findIndex(
          (order) => order.table === payload.table
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = payload;
        }
        state.tablesStatus = mapAndSortTablesByStatus(state.orders);
      }
    );
  },
});

export const waiterActions = waiterSlice.actions;

export default waiterSlice.reducer;
