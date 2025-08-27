// import { create } from "@mui/material/styles/createTransitions";
import { api } from "./baseApi";
import {
  OrderResponseDto,
  BillResponseDto,
  CategoryWithProductsDto,
} from "types";

interface CreateOrderType {
  table: number;
  products: { id: string; quantity: number }[];
}

export const waiterApi = api.injectEndpoints({
  endpoints: (build) => ({
    waiterGetProducts: build.query<CategoryWithProductsDto[], void>({
      query: () => `waiter/products`,
      providesTags: ["Products"],
    }),
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
    getBills: build.query<BillResponseDto[], number>({
      query: (tableNumber: number) => `waiter/bills/${tableNumber}`,
      providesTags: (result, error, tableNumber) => [
        { type: "Bill", id: tableNumber },
      ],
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
    waiterCreateOrder: build.mutation<void, CreateOrderType>({
      query: (params: CreateOrderType) => {
        return {
          url: `waiter/create-order/${params.table}`,
          method: "POST",
          body: { products: params.products },
        };
      },
      invalidatesTags: (result, error, { table }) => [
        { type: "Order", id: table },
        { type: "Order", id: "LIST" },
      ],
    }),
    createWaiterBill: build.mutation<
      void,
      { orderProductId: string; quantity: number }[]
    >({
      query: (productsToPay) => ({
        url: `waiter/create-bill`,
        method: "POST",
        body: {
          orderProducts: productsToPay,
          paymentMethod: "cash",
          tips: 0,
        },
      }),
      invalidatesTags: (result, error, productsToPay) => {
        return [{ type: "Bill" }];
      },
    }),
    goToTable: build.mutation<void, number>({
      query: (tableNumber) => ({
        url: `waiter/respond-to-call/${tableNumber}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, tableNumber) => [{ type: "Order" }],
    }),
    payBill: build.mutation<void, string>({
      query: (billId) => ({
        url: `waiter/pay-bill/${billId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, billId) => [
        { type: "Bill" },
        { type: "Order" },
      ],
    }),
  }),
});

export const {
  useWaiterGetProductsQuery,
  useLazyGetOrderQuery,
  useGetOrdersQuery,
  useGetBillsQuery,
  useLazyGetBillsQuery,
  useDeliverMutation,
  useCreateWaiterBillMutation,
  useGoToTableMutation,
  usePayBillMutation,
  useWaiterCreateOrderMutation,
} = waiterApi;
