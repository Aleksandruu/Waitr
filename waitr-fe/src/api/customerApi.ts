import { api } from "./baseApi";
import { ProductsResponse } from "shared/models/products.response.model";

export const customerApi = api.injectEndpoints({
  endpoints: (build) => ({
    products: build.query<ProductsResponse[], string>({
      query: (locationSlug: string) => `customer/${locationSlug}/product`,
    }),
  }),
});

export const { useProductsQuery } = customerApi;
