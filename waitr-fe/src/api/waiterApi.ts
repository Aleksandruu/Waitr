import { api } from "./baseApi";
import { TableStatus, OrderResponseDto } from "shared";

export const waiterApi = api.injectEndpoints({
  endpoints: (build) => ({
    getOrder: build.query<OrderResponseDto, number>({
      query: (tableNumber: number) => `waiter/order/${tableNumber}`,
      providesTags: (result, error, tableNumber) => [
        { type: "Order", id: tableNumber },
      ],
    }),
    getOrders: build.query<OrderResponseDto[], void>({
      query: () => `waiter/orders`,
      providesTags: [{ type: "Order", id: "LIST" }],
    }),
    deliver: build.mutation<
      void,
      { orderProductId: string; tableNumber: number }
    >({
      query: ({ orderProductId, tableNumber }) => ({
        url: `waiter/deliver`,
        method: "PATCH",
        body: { orderProductId },
      }),
      invalidatesTags: (result, error, { tableNumber }) => [
        { type: "Order", id: tableNumber },
      ],
    }),
    pay: build.mutation<void, { orderProductId: string; quantity: number }[]>({
      query: (productsToPay) => ({
        url: `waiter/pay`,
        method: "PATCH",
        body: productsToPay,
      }),
    }),
  }),
});

export const {
  useLazyGetOrderQuery,
  useGetOrdersQuery,
  useDeliverMutation,
  usePayMutation,
} = waiterApi;
