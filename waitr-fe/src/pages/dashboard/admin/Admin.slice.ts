import { createSlice } from "@reduxjs/toolkit";
import { adminApi } from "../../../api/adminApi";
import { LocationResponseDto } from "shared";

export interface AdminState {
  locations: LocationResponseDto[];
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
