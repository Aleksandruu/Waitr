import { LoginRequest, LoginResponse } from "../types";

export const createAuthApi = (api: any) =>
  api.injectEndpoints({
    endpoints: (build: any) => ({
      login: build.mutation({
        query: (credentials: LoginRequest) => ({
          url: "auth/login",
          method: "POST",
          body: credentials,
        }),
        invalidatesTags: [
          "Settings",
          "Staff",
          "Locations",
          "Order",
          "Categories",
          "Products",
          "CalledWaiter",
          "Bill",
        ],
      }),
    }),
  });
