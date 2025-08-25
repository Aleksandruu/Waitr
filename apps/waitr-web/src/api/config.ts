import { createBaseApi, createAllApis } from "shared";
import { RootState } from "../store";

const apiUrl = import.meta.env.VITE_APP_API_URL;

// Create the base API with web-specific configuration
export const api = createBaseApi({
  baseUrl: apiUrl,
  getAuthToken: (getState: () => RootState) =>
    (getState() as RootState).auth.token,
  platform: "web",
});

// Create all API endpoints and hooks
export const {
  adminApi,
  authApi,
  customerApi,
  managerApi,
  staffApi,
  waiterApi,
  // Admin hooks
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useCreateLocationMutation,
  useChangeActiveStatusMutation,
  // Auth hooks
  useLoginMutation,
  // Customer hooks
  useGetProductsQuery,
  useCreateOrderMutation,
  useGetCurrentOrderQuery,
  useGetUnpaidOrderQuery,
  useAddProductsToOrderMutation,
  useCallWaiterMutation,
  useIsWaiterCalledQuery,
  useCreateBillMutation,
  // Manager hooks
  useGetStaffQuery,
  useCreateStaffMutation,
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetLocationQuery,
  useGetLocationSettingsQuery,
  useUpdateSettingsMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useDeleteCategoryMutation,
  useDeleteProductMutation,
  // Staff hooks
  useLazyGetStaffProductsQuery,
  useMarkProductReadyMutation,
  // Waiter hooks
  useWaiterGetProductsQuery,
  useLazyGetOrderQuery,
  useGetOrdersQuery,
  useGetBillsQuery,
  useLazyGetBillsQuery,
  useDeliverMutation,
  useCreateWaiterBillMutation,
  useGoToTableMutation,
  usePayBillMutation,
  useWaiterCreateOrderMutation,
} = createAllApis(api);
