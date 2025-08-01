import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// const apiUrl = import.meta.env.VITE_APP_API_URL;
const apiUrl = "http://localhost:8080";
// const apiUrl = "https://waitr-djfkfhdwgvete8cg.westeurope-01.azurewebsites.net";

const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
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
