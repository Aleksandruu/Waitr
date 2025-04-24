import { LoginRequest } from "shared/models/login.request.model";
import { LoginResponse } from "shared/models/login.response.model";
import { api } from "./baseApi";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
