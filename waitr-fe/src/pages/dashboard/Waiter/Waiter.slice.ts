import { createSlice } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../../../helpers/reduxReducerGenerator";
import { TableStatus } from "shared/models/tablesStatus.model";
import { waiterApi } from "waitr-fe/src/api/waiterApi";
import { OrderResponseDto } from "shared";
import { mapAndSortTablesByStatus } from "waitr-fe/src/helpers/createTablesStatusArray";

export interface WaiterState {
  selectedTable: number;
  tablesStatus: TableStatus[];
  orders: OrderResponseDto[];
}

const initialState: WaiterState = {
  selectedTable: 0,
  tablesStatus: [],
  orders: [],
};

export const waiterSlice = createSlice({
  name: "waiter",
  initialState,
  reducers: {
    ...generateSetterReducers<WaiterState>(initialState),
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
