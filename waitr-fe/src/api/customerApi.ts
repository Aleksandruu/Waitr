import { api } from "./baseApi";
import {
  CreateOrderDto,
  CategoryWithProductsDto,
  CartItemDto,
  CreateBillDto,
} from "shared";

interface OrderType {
  order: CreateOrderDto;
  locationSlug: string;
  tableNumber: number;
}

interface CallWaiterType {
  locationSlug: string;
  tableNumber: number;
}

interface BillRequestType {
  bill: CreateBillDto;
  locationSlug: string;
  tableNumber: number;
}

export const customerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<CategoryWithProductsDto[], string>({
      query: (locationSlug: string) => `customer/${locationSlug}/product`,
    }),
    createOrder: build.mutation<void, OrderType>({
      query: (order: OrderType) => {
        return {
          url: `customer/order/${order.locationSlug}/${order.tableNumber}`,
          method: "POST",
          body: order.order,
        };
      },
    }),
    addProductsToOrder: build.mutation<void, OrderType>({
      query: (order: OrderType) => {
        return {
          url: `customer/order/${order.locationSlug}/${order.tableNumber}`,
          method: "PUT",
          body: order.order,
        };
      },
    }),
    getCurrentOrder: build.query<
      CartItemDto[],
      { locationSlug: string; table: number }
    >({
      query: (locationTable: { locationSlug: string; table: number }) =>
        `customer/order/${locationTable.locationSlug}/${locationTable.table}`,
    }),
    getUnpaidOrder: build.query<
      CartItemDto[],
      { locationSlug: string; table: number }
    >({
      query: (locationTable: { locationSlug: string; table: number }) =>
        `customer/unpaid-order/${locationTable.locationSlug}/${locationTable.table}`,
    }),
    callWaiter: build.mutation<void, CallWaiterType>({
      query: (params: CallWaiterType) => {
        return {
          url: `customer/call-waiter/${params.locationSlug}/${params.tableNumber}`,
          method: "POST",
        };
      },
      invalidatesTags: ["CalledWaiter"],
    }),
    isWaiterCalled: build.query<
      boolean,
      { locationSlug: string; table: number }
    >({
      query: (params: { locationSlug: string; table: number }) =>
        `customer/waiter-called/${params.locationSlug}/${params.table}`,
      providesTags: (result, error, params) => [{ type: "CalledWaiter" }],
    }),
    createBill: build.mutation<void, BillRequestType>({
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

export const {
  useGetProductsQuery,
  useCreateOrderMutation,
  useGetCurrentOrderQuery,
  useGetUnpaidOrderQuery,
  useAddProductsToOrderMutation,
  useCallWaiterMutation,
  useIsWaiterCalledQuery,
  useCreateBillMutation,
} = customerApi;
