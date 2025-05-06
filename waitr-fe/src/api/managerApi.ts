import { StaffMember } from "shared/models/staffMember.model";
import { StaffMemberRequest } from "shared/models/staffMember.request.model";
import { ILocation } from "shared/models/location.response.model";
import { api } from "./baseApi";
import { LocationSettings } from "shared/models/locationSettings.model";
import { LocationSettingsResponse } from "shared/models/locationSettings.response.model";
import { bufferToFile } from "../helpers/byteArrayToFile";

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
    getLocation: build.query<ILocation, void>({
      query: () => "manager/location",
      providesTags: ["Settings"],
    }),
    getLocationSettings: build.query<LocationSettingsResponse, void>({
      query: () => "manager/location/settings",
      providesTags: ["Settings"],
    }),
    updateSettings: build.mutation<void, LocationSettings>({
      query: (settings: LocationSettings) => {
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
