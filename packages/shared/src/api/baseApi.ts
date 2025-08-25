import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ApiConfig {
  baseUrl: string;
  getAuthToken: (getState?: any) => string | null;
  platform: "web" | "mobile";
  customHeaders?: Record<string, string>;
}

export const createBaseApi = (config: ApiConfig) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: config.baseUrl,
    prepareHeaders: (headers: Headers, api: { getState: () => any }) => {
      let token: string | null = null;

      if (config.platform === "web" && api.getState) {
        token = config.getAuthToken(api.getState);
      } else if (config.platform === "mobile") {
        token = config.getAuthToken();
      }

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      if (config.customHeaders) {
        Object.entries(config.customHeaders).forEach(([key, value]) => {
          headers.set(key, value);
        });
      }

      return headers;
    },
  });

  return createApi({
    baseQuery: baseQuery,
    tagTypes: [
      "Locations",
      "Staff",
      "Settings",
      "Order",
      "Categories",
      "Products",
      "CalledWaiter",
      "Bill",
    ],
    endpoints: () => ({}),
  });
};
