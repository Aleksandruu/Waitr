import { ILocation } from "../models/location.model";
import { api } from "./baseApi";

export const adminApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<ILocation[], void>({
      query: () => "admin/locations",
    }),
    getLocationById: build.query<ILocation, string>({
      query: (id) => `admin/locations/${id}`,
    }),
  }),
});

export const { useGetLocationsQuery, useGetLocationByIdQuery } = adminApi;
