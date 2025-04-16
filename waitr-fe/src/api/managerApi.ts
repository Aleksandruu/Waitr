import { ILocation, StaffMember } from "../models/location.model";
import { StaffMemberRequest } from "../models/user.model";
import { getLocation } from "../service/adminService";
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
    getLocation: build.query<ILocation, void>({
      query: () => "manager/location",
    }),
  }),
});

export const { useGetStaffQuery, useCreateStaffMutation, useGetLocationQuery } =
  managerApi;
