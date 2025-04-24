import { ILocation } from "shared/models/location.response.model";
import { ILocationRequest } from "shared/models/location.request.model";
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
    createLocation: build.mutation<ILocation, ILocationRequest>({
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
