import { CreateLocationDto, LocationResponseDto } from "shared";
import { api } from "./baseApi";

export const adminApi = api.injectEndpoints({
  endpoints: (build) => ({
    getLocations: build.query<LocationResponseDto[], void>({
      query: () => "admin/locations",
      providesTags: ["Locations"],
    }),
    getLocationById: build.query<LocationResponseDto, string>({
      query: (id) => `admin/locations/${id}`,
    }),
    createLocation: build.mutation<LocationResponseDto, CreateLocationDto>({
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
