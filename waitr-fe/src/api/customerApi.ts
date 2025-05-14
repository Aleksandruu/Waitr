import { api } from "./baseApi";
import { CreateOrderDto, CategoryWithProductsDto, CartItemDto } from "shared";

interface OrderType {
  order: CreateOrderDto;
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
  }),
});

export const {
  useGetProductsQuery,
  useCreateOrderMutation,
  useGetCurrentOrderQuery,
  useAddProductsToOrderMutation,
} = customerApi;
