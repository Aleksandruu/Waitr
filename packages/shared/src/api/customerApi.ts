import {
  CreateOrderDto,
  CategoryWithProductsDto,
  CartItemDto,
  CreateBillDto,
} from "../types";

export interface OrderType {
  order: CreateOrderDto;
  locationSlug: string;
  tableNumber: number;
}

export interface CallWaiterType {
  locationSlug: string;
  tableNumber: number;
}

export interface BillRequestType {
  bill: CreateBillDto;
  locationSlug: string;
  tableNumber: number;
}

export const createCustomerApi = (api: any) =>
  api.injectEndpoints({
    endpoints: (build: any) => ({
      getProducts: build.query({
        query: (locationSlug: string) => `customer/${locationSlug}/product`,
      }),
      createOrder: build.mutation({
        query: (order: OrderType) => {
          return {
            url: `customer/order/${order.locationSlug}/${order.tableNumber}`,
            method: "POST",
            body: order.order,
          };
        },
      }),
      addProductsToOrder: build.mutation({
        query: (order: OrderType) => {
          return {
            url: `customer/order/${order.locationSlug}/${order.tableNumber}`,
            method: "PUT",
            body: order.order,
          };
        },
      }),
      getCurrentOrder: build.query({
        query: (locationTable: { locationSlug: string; table: number }) =>
          `customer/order/${locationTable.locationSlug}/${locationTable.table}`,
      }),
      getUnpaidOrder: build.query({
        query: (locationTable: { locationSlug: string; table: number }) =>
          `customer/unpaid-order/${locationTable.locationSlug}/${locationTable.table}`,
      }),
      callWaiter: build.mutation({
        query: (params: CallWaiterType) => {
          return {
            url: `customer/call-waiter/${params.locationSlug}/${params.tableNumber}`,
            method: "POST",
          };
        },
        invalidatesTags: ["CalledWaiter"],
      }),
      isWaiterCalled: build.query({
        query: (params: { locationSlug: string; table: number }) =>
          `customer/waiter-called/${params.locationSlug}/${params.table}`,
        providesTags: (result: any, error: any, params: any) => [
          { type: "CalledWaiter" },
        ],
      }),
      createBill: build.mutation({
        query: (params: BillRequestType) => {
          return {
            url: `customer/bill/${params.locationSlug}/${params.tableNumber}`,
            method: "POST",
            body: params.bill,
          };
        },
      }),
    }),
  });
