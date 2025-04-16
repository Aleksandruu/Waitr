import { ILocation, ILocationForm } from "../models/location.model";
import { api } from "./baseApi";

export const adminApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<ILocation[], void>({
      query: () => "admin/locations",
      providesTags: ["Locations"],
    }),
    getLocationById: build.query<ILocation, string>({
      query: (id) => `admin/locations/${id}`,
    }),
    createLocation: build.mutation<ILocation, ILocationForm>({
      query: (location) => ({
        url: "admin/locations",
        method: "POST",
        body: location,
      }),
      invalidatesTags: ["Locations"],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useCreateLocationMutation,
} = adminApi;
