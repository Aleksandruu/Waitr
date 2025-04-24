import { createSlice } from "@reduxjs/toolkit";
import { generateSetterReducers } from "../helpers/reduxReducerGenerator";
import { managerApi } from "../api/managerApi";
import { generateColorVars } from "../helpers/generateColorVars";

export interface LocationState {
  id: string;
  slug: string;
  name: string;
  logo: string;
  logoMime: string;
  color: string | null;
}

const initialState: LocationState = {
  id: "",
  slug: "",
  name: "",
  logo: "",
  logoMime: "",
  color: localStorage.getItem("locationColor") || null,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    ...generateSetterReducers<LocationState>(initialState),
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      managerApi.endpoints.getLocation.matchFulfilled,
      (state, { payload }) => {
        state = payload;
        console.log(payload);
        localStorage.setItem("locationColor", payload.color);
        const vars = generateColorVars(payload.color);
        Object.entries(vars).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      }
    );
  },
});

export const locationActions = locationSlice.actions;

export default locationSlice.reducer;
