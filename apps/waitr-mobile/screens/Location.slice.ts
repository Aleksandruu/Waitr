import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../helpers/reduxReducerGenerator";
import { managerApi } from "../api/managerApi";
import { generateColorVars } from "../helpers/generateColorVars";
import { FileBuffer } from "shared";
import * as jwtDecode from "jwt-decode";
import * as SecureStore from "expo-secure-store";

export interface LocationState {
  initialState?: LocationState;
  id: string;
  slug: string;
  name: string;
  color?: string;
  logoBuffer?: FileBuffer;
  logoMime?: string;
}

const getTokenSync = (): string | null => {
  // SecureStore is async; we cannot read synchronously here.
  // We will rely on auth slice to populate token at runtime.
  return null;
};

const getInitialColor = (): string | undefined => {
  try {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem("locationColor") || undefined;
    }
  } catch {}
  return undefined;
};

const initialState: LocationState = {
  initialState: undefined,
  id: "", // will be set when token is available
  slug: "",
  name: "",
  color: getInitialColor(),
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
      if (state.color) generateColorVars(state.color);
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

          try {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("locationColor", payload.color!);
            }
          } catch {}
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

          try {
            if (typeof localStorage !== "undefined") {
              localStorage.setItem("locationColor", payload.color);
            }
          } catch {}
          generateColorVars(payload.color);
        }
      );
  },
});

export const locationActions = locationSlice.actions;

export default locationSlice.reducer;
