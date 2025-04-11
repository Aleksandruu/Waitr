import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { User } from "../../models/user.model";
import { authApi } from "../../api/authApi";
import { generateSetterReducers } from "../../helpers/reduxReducerGenerator";

export interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: boolean;
}

const initialState: AuthState = {
  user: localStorage.getItem("waitr_token")
    ? (jwtDecode(localStorage.getItem("waitr_token")!) as User)
    : null,
  token: localStorage.getItem("waitr_token") || null,
  loading: false,
  error: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    ...generateSetterReducers<AuthState>(initialState),
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("waitr_token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.token = payload.accessToken;
          const token = state.token;
          if (token) {
            state.user = jwtDecode(payload.accessToken) as User;
            localStorage.setItem("waitr_token", payload.accessToken);
          }
          state.loading = false;
        }
      )
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;
