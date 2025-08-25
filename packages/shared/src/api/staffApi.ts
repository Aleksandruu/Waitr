import { OrderProductDto } from "../types";

export const createStaffApi = (api: any) =>
  api.injectEndpoints({
    endpoints: (build: any) => ({
      getStaffProducts: build.query({
        query: () => "staff/products",
        providesTags: ["Staff"],
      }),
      markProductReady: build.mutation({
        query: (data: { orderProductId: number; tableNumber: number }) => ({
          url: "staff/ready",
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["Staff"],
      }),
    }),
  });
