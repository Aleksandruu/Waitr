import { LoginRequest, LoginResponse } from "shared";
import { api } from "./baseApi";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
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

export const { useLoginMutation } = authApi;
