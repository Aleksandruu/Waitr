import type {
  Action,
  ConfigureStoreOptions,
  ThunkAction,
} from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import auth from "./pages/Login/Auth.slice";
import admin from "./pages/Dashboard/Admin/Admin.slice";
import location from "./pages/Location.slice";
import order from "./pages/Customer/Customer.slice";
import waiter from "./pages/Dashboard/Waiter/Waiter.slice";
import { api } from "./api/baseApi";
import { persistOrderProducts } from "./helpers/localstoragePersistenceMiddleware";

export const createStore = (
  options?: ConfigureStoreOptions["preloadedState"] | undefined
) =>
  configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      auth,
      admin,
      location,
      order,
      waiter,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware, persistOrderProducts),
    ...options,
  });

export const store = createStore();

export type AppStore = ReturnType<typeof createStore>;

export interface RootState {
  auth: ReturnType<typeof auth>;
  admin: ReturnType<typeof admin>;
  location: ReturnType<typeof location>;
  order: ReturnType<typeof order>;
  waiter: ReturnType<typeof waiter>;
  [api.reducerPath]: ReturnType<typeof api.reducer>;
}

export type AppDispatch = AppStore["dispatch"];

export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
