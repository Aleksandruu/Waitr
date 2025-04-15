import { createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../../api/adminApi";
import { ILocation } from "../../../models/location.model";

export interface AdminState {
  locations: ILocation[];
  loading: boolean;
}

const initialState: AdminState = {
  locations: [],
  loading: false,
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        adminApi.endpoints.getLocations.matchFulfilled,
        (state, { payload }) => {
          state.locations = payload;
          state.loading = false;
        }
      )
      .addMatcher(adminApi.endpoints.getLocations.matchPending, (state) => {
        state.loading = true;
      })
      .addMatcher(adminApi.endpoints.getLocations.matchRejected, (state) => {
        state.loading = false;
      });
  },
});

export const adminActions = adminSlice.actions;

export default adminSlice.reducer;
