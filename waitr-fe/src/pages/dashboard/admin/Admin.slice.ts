import { createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../../api/adminApi";
import { ILocation } from "shared/models/location.response.model";

export interface AdminState {
  locations: ILocation[];
}

const initialState: AdminState = {
  locations: [],
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
    builder.addMatcher(
      adminApi.endpoints.getLocations.matchFulfilled,
      (state, { payload }) => {
        state.locations = payload;
      }
    );
  },
});

export const adminActions = adminSlice.actions;

export default adminSlice.reducer;
