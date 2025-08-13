import { OrderProductDto } from "shared";
import { api } from "./baseApi";

export const staffApi = api.injectEndpoints({
  endpoints: (build) => ({
    getStaffProducts: build.query<OrderProductDto[], void>({
      query: () => "staff/products",
      providesTags: ["Staff"],
    }),
    markProductReady: build.mutation<
      any,
      { orderProductId: number; tableNumber: number }
    >({
      query: (data) => ({
        url: "staff/ready",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Staff"],
    }),
  }),
});

export const { useLazyGetStaffProductsQuery, useMarkProductReadyMutation } =
  staffApi;
