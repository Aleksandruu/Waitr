import { CreateLocationDto, LocationResponseDto } from "../types";

export const createAdminApi = (api: any) =>
  api.injectEndpoints({
    endpoints: (build: any) => ({
      getLocations: build.query({
        query: () => "admin/locations",
        providesTags: ["Locations"],
      }),
      getLocationById: build.query({
        query: (id: string) => `admin/locations/${id}`,
      }),
      createLocation: build.mutation({
        query: (location: CreateLocationDto) => ({
          url: "admin/locations",
          method: "POST",
          body: location,
        }),
        invalidatesTags: ["Locations"],
      }),
      changeActiveStatus: build.mutation({
        query: ({ id, active }: { id: string; active: boolean }) => ({
          url: `admin/locations/${id}/active`,
          method: "PATCH",
          body: { active },
        }),
        invalidatesTags: ["Locations"],
      }),
    }),
  });
