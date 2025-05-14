import {
  StaffMember,
  UpdateLocationSettingsDto,
  LocationSettingsDto,
  LocationResponseDto,
  StaffMemberRequest,
} from "shared";
import { api } from "./baseApi";

export const managerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getStaff: build.query<StaffMember[], void>({
      query: () => "manager/employee",
      providesTags: ["Staff"],
    }),
    createStaff: build.mutation<void, StaffMemberRequest>({
      query: (staff) => ({
        url: "manager/employee",
        method: "POST",
        body: staff,
      }),
      invalidatesTags: ["Staff"],
    }),
    getLocation: build.query<LocationResponseDto, void>({
      query: () => "manager/location",
      providesTags: ["Settings"],
    }),
    getLocationSettings: build.query<LocationSettingsDto, void>({
      query: () => "common/location/settings",
      providesTags: ["Settings"],
    }),
    updateSettings: build.mutation<void, UpdateLocationSettingsDto>({
      query: (settings: UpdateLocationSettingsDto) => {
        const formData = new FormData();
        formData.append("name", settings.name);
        formData.append("slug", settings.slug);
        formData.append("color", settings.color!);
        if (settings.logo) {
          formData.append("logo", settings.logo);
        }

        return {
          url: `manager/location/settings`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetStaffQuery,
  useCreateStaffMutation,
  useGetLocationQuery,
  useGetLocationSettingsQuery,
  useUpdateSettingsMutation,
} = managerApi;
