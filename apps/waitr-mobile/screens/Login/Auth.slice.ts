import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { UserModel } from "shared";
import { authApi } from "../../api/authApi";
import { generateSetterReducers } from "../../helpers/reduxReducerGenerator";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "waitr_token";

export interface AuthState {
  token: string | null;
  user: UserModel | null;
  loading: boolean;
  error: boolean;
}

// Hydrate auth state from secure storage on app start
export const hydrateAuth = createAsyncThunk("auth/hydrate", async () => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const user = token ? (jwtDecode(token) as UserModel) : null;
  return { token, user } as { token: string | null; user: UserModel | null };
});

const initialState: AuthState = {
  user: null,
  token: null,
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
      // Persist logout
      SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    },
  },
  extraReducers: (builder) => {
    builder
      // Hydration handler
      .addCase(hydrateAuth.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.user = payload.user;
      })
      // Login lifecycle
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          state.token = payload.accessToken;
          if (state.token) {
            state.user = jwtDecode(payload.accessToken) as UserModel;
            // Persist token securely
            SecureStore.setItemAsync(TOKEN_KEY, payload.accessToken).catch(
              () => {}
            );
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
