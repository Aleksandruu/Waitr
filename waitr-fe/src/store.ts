import type {
  Action,
  ConfigureStoreOptions,
  ThunkAction,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import auth from "./pages/login/Auth.slice";
import admin from "./pages/dashboard/Admin/Admin.slice";
import location from "./pages/Location.slice";
import { api } from "./api/baseApi";

export const createStore = (
  options?: ConfigureStoreOptions["preloadedState"] | undefined
) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth,
      admin,
      location,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
    ...options,
  });

export const store = createStore();

export type AppStore = typeof store;

export type RootState = ReturnType<AppStore["getState"]>;

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
