import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../helpers/reduxReducerGenerator";
import { managerApi } from "../api/managerApi";
import { generateColorVars } from "../helpers/generateColorVars";
import { bufferToFile } from "../helpers/byteArrayToFile";

export interface LocationState {
  initialState: LocationState | undefined;
  id: string;
  slug: string;
  name: string;
  color: string | undefined;
  logoBuffer:
    | {
        type: "Buffer";
        data: number[] | Uint8Array;
      }
    | undefined;
  logoMime?: string;
}

const initialState: LocationState = {
  initialState: undefined,
  id: "",
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
