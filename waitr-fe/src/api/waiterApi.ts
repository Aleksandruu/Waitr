import { api } from "./baseApi";
import { TableStatus, OrderResponseDto } from "shared";

export const waiterApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrder: build.query<OrderResponseDto, number>({
      query: (tableNumber: number) => `waiter/order/${tableNumber}`,
    }),
    getOrders: build.query<OrderResponseDto[], void>({
      query: () => `waiter/orders`,
    }),
  }),
});

export const { useLazyGetOrderQuery, useGetOrdersQuery } = waiterApi;
