import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../helpers/reduxReducerGenerator";
import { managerApi } from "../api/managerApi";
import { generateColorVars } from "../helpers/generateColorVars";
import { FileBuffer } from "types";
import * as jwtDecode from "jwt-decode";

export interface LocationState {
  initialState?: LocationState;
  id: string;
  slug: string;
  name: string;
  color?: string;
  logoBuffer?: FileBuffer;
  logoMime?: string;
}

const getLocationIdFromToken = () => {
  const token = localStorage.getItem("waitr_token");
  if (token) {
    const decodedToken = jwtDecode.jwtDecode<{ locationId: string }>(token);
    return decodedToken.locationId;
  }
  return "";
};

const initialState: LocationState = {
  initialState: undefined,
  id: getLocationIdFromToken(),
  slug: "",
  name: "",
  color: localStorage.getItem("locationColor") || undefined,
  logoBuffer: undefined,
  logoMime: "",
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    ...generateSetterReducers<LocationState>(initialState),
    changeColorFromSettings(state, action: PayloadAction<string>) {
      state.color = action.payload;
      generateColorVars(action.payload);
    },
    changeLogoBuffer(
      state,
      action: PayloadAction<{
        type: "Buffer";
        data: number[] | Uint8Array;
      }>
    ) {
      state.logoBuffer = action.payload;
    },
    changeLogoMime(state, action: PayloadAction<string>) {
      state.logoMime = action.payload;
    },
    saveInitialState(state) {
      state.initialState = { ...state, initialState: undefined };
    },
    goBackToInitialState(state) {
      if (state.initialState) {
        Object.assign(state, state.initialState);
      }
      generateColorVars(state.color!);
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        managerApi.endpoints.getLocation.matchFulfilled,
        (state, { payload }) => {
          state.id = payload.id;
          state.slug = payload.slug;
          state.name = payload.name;
          state.color = payload.color!;

          state.logoBuffer = payload.logo;
          state.logoMime = payload.logoMime;

          localStorage.setItem("locationColor", payload.color!);
          generateColorVars(payload.color!);
        }
      )
      .addMatcher(
        managerApi.endpoints.getLocationSettings.matchFulfilled,
        (state, { payload }) => {
          state.slug = payload.slug;
          state.name = payload.name;
          state.color = payload.color;

          state.logoBuffer = payload.logo;
          state.logoMime = payload.logoMime;

          localStorage.setItem("locationColor", payload.color);
          generateColorVars(payload.color);
        }
      );
  },
});

export const locationActions = locationSlice.actions;

export default locationSlice.reducer;
