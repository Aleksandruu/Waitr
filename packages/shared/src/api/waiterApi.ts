import {
  OrderResponseDto,
  BillResponseDto,
  CategoryWithProductsDto,
} from "../types";

export interface CreateOrderType {
  table: number;
  products: { id: string; quantity: number }[];
}

export const createWaiterApi = (api: any) =>
  api.injectEndpoints({
    endpoints: (build: any) => ({
      waiterGetProducts: build.query({
        query: () => `waiter/products`,
        providesTags: ["Products"],
      }),
      getOrder: build.query({
        query: (tableNumber: number) => `waiter/order/${tableNumber}`,
        providesTags: (result: any, error: any, tableNumber: number) => [
          { type: "Order", id: tableNumber },
        ],
      }),
      getOrders: build.query({
        query: () => `waiter/orders`,
        providesTags: [{ type: "Order", id: "LIST" }],
      }),
      getBills: build.query({
        query: (tableNumber: number) => `waiter/bills/${tableNumber}`,
        providesTags: (result: any, error: any, tableNumber: number) => [
          { type: "Bill", id: tableNumber },
        ],
      }),
      deliver: build.mutation({
        query: ({
          orderProductId,
          tableNumber,
        }: {
          orderProductId: string;
          tableNumber: number;
        }) => ({
          url: `waiter/deliver`,
          method: "PATCH",
          body: { orderProductId },
        }),
        invalidatesTags: (
          result: any,
          error: any,
          { tableNumber }: { tableNumber: number }
        ) => [{ type: "Order", id: tableNumber }],
      }),
      waiterCreateOrder: build.mutation({
        query: (params: CreateOrderType) => {
          return {
            url: `waiter/create-order/${params.table}`,
            method: "POST",
            body: { products: params.products },
          };
        },
        invalidatesTags: (
          result: any,
          error: any,
          { table }: CreateOrderType
        ) => [
          { type: "Order", id: table },
          { type: "Order", id: "LIST" },
        ],
      }),
      createWaiterBill: build.mutation({
        query: (
          productsToPay: { orderProductId: string; quantity: number }[]
        ) => ({
          url: `waiter/create-bill`,
          method: "POST",
          body: {
            orderProducts: productsToPay,
            paymentMethod: "cash",
            tips: 0,
          },
        }),
        invalidatesTags: (result: any, error: any, productsToPay: any) => {
          return [{ type: "Bill" }];
        },
      }),
      goToTable: build.mutation({
        query: (tableNumber: number) => ({
          url: `waiter/respond-to-call/${tableNumber}`,
          method: "POST",
        }),
        invalidatesTags: (result: any, error: any, tableNumber: number) => [
          { type: "Order" },
        ],
      }),
      payBill: build.mutation({
        query: (billId: string) => ({
          url: `waiter/pay-bill/${billId}`,
          method: "POST",
        }),
        invalidatesTags: (result: any, error: any, billId: string) => [
          { type: "Bill" },
          { type: "Order" },
        ],
      }),
    }),
  });
