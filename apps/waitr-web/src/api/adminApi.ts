import { CreateLocationDto, LocationResponseDto } from "types";
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
    changeActiveStatus: build.mutation<void, { id: string; active: boolean }>({
      query: ({ id, active }) => ({
        url: `admin/locations/${id}/active`,
        method: "PATCH",
        body: { active },
      }),
      invalidatesTags: ["Locations"],
    }),
  }),
});

export const {
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useCreateLocationMutation,
  useChangeActiveStatusMutation,
} = adminApi;
