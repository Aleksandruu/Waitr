import { createBaseApi, createAllApis } from "shared";

const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";

// Create the base API with mobile-specific configuration
export const api = createBaseApi({
  baseUrl: apiUrl,
  getAuthToken: (getState) => {
    // Assuming you have an auth slice in your Redux store
    // You'll need to adjust this path based on your actual Redux structure
    return getState?.()?.auth?.token || null;
  },
  platform: "mobile",
});

// Lazy initialization of APIs and hooks
let apiInstances: ReturnType<typeof createAllApis> | null = null;

export const getApiInstances = () => {
  if (!apiInstances) {
    apiInstances = createAllApis(api);
  }
  return apiInstances;
};

// Export individual APIs and hooks through getters
export const getAdminApi = () => getApiInstances().adminApi;
export const getAuthApi = () => getApiInstances().authApi;
export const getCustomerApi = () => getApiInstances().customerApi;
export const getManagerApi = () => getApiInstances().managerApi;
export const getStaffApi = () => getApiInstances().staffApi;
export const getWaiterApi = () => getApiInstances().waiterApi;

// Export hooks through getters
export const useGetLocationsQuery = (
  ...args: Parameters<ReturnType<typeof createAllApis>["useGetLocationsQuery"]>
) => getApiInstances().useGetLocationsQuery(...args);
export const useGetLocationByIdQuery = (
  ...args: Parameters<
    ReturnType<typeof createAllApis>["useGetLocationByIdQuery"]
  >
) => getApiInstances().useGetLocationByIdQuery(...args);
export const useCreateLocationMutation = () =>
  getApiInstances().useCreateLocationMutation();
export const useChangeActiveStatusMutation = () =>
  getApiInstances().useChangeActiveStatusMutation();

// Auth hooks
export const useLoginMutation = () => getApiInstances().useLoginMutation();

// Customer hooks
export const useGetProductsQuery = (
  ...args: Parameters<ReturnType<typeof createAllApis>["useGetProductsQuery"]>
) => getApiInstances().useGetProductsQuery(...args);
export const useCreateOrderMutation = () =>
  getApiInstances().useCreateOrderMutation();
export const useGetCurrentOrderQuery = (
  ...args: Parameters<
    ReturnType<typeof createAllApis>["useGetCurrentOrderQuery"]
  >
) => getApiInstances().useGetCurrentOrderQuery(...args);
export const useGetUnpaidOrderQuery = (
  ...args: Parameters<
    ReturnType<typeof createAllApis>["useGetUnpaidOrderQuery"]
  >
) => getApiInstances().useGetUnpaidOrderQuery(...args);
export const useAddProductsToOrderMutation = () =>
  getApiInstances().useAddProductsToOrderMutation();
export const useCallWaiterMutation = () =>
  getApiInstances().useCallWaiterMutation();
export const useIsWaiterCalledQuery = (
  ...args: Parameters<
    ReturnType<typeof createAllApis>["useIsWaiterCalledQuery"]
  >
) => getApiInstances().useIsWaiterCalledQuery(...args);
export const useCreateBillMutation = () =>
  getApiInstances().useCreateBillMutation();

// Manager hooks
export const useGetStaffQuery = (
  ...args: Parameters<ReturnType<typeof createAllApis>["useGetStaffQuery"]>
) => getApiInstances().useGetStaffQuery(...args);
export const useCreateStaffMutation = () =>
  getApiInstances().useCreateStaffMutation();
export const useCreateCategoryMutation = () =>
  getApiInstances().useCreateCategoryMutation();
export const useGetCategoriesQuery = (
  ...args: Parameters<ReturnType<typeof createAllApis>["useGetCategoriesQuery"]>
) => getApiInstances().useGetCategoriesQuery(...args);
export const useGetLocationQuery = (
  ...args: Parameters<ReturnType<typeof createAllApis>["useGetLocationQuery"]>
) => getApiInstances().useGetLocationQuery(...args);
export const useGetLocationSettingsQuery = (
  ...args: Parameters<
    ReturnType<typeof createAllApis>["useGetLocationSettingsQuery"]
  >
) => getApiInstances().useGetLocationSettingsQuery(...args);
export const useUpdateSettingsMutation = () =>
  getApiInstances().useUpdateSettingsMutation();
export const useCreateProductMutation = () =>
  getApiInstances().useCreateProductMutation();
export const useUpdateProductMutation = () =>
  getApiInstances().useUpdateProductMutation();
export const useGetAllProductsQuery = (
  ...args: Parameters<
    ReturnType<typeof createAllApis>["useGetAllProductsQuery"]
  >
) => getApiInstances().useGetAllProductsQuery(...args);
export const useGetProductByIdQuery = (
  ...args: Parameters<
    ReturnType<typeof createAllApis>["useGetProductByIdQuery"]
  >
) => getApiInstances().useGetProductByIdQuery(...args);
export const useDeleteCategoryMutation = () =>
  getApiInstances().useDeleteCategoryMutation();
export const useDeleteProductMutation = () =>
  getApiInstances().useDeleteProductMutation();

// Staff hooks
export const useLazyGetStaffProductsQuery = () =>
  getApiInstances().useLazyGetStaffProductsQuery();
export const useMarkProductReadyMutation = () =>
  getApiInstances().useMarkProductReadyMutation();

// Waiter hooks
export const useWaiterGetProductsQuery = (
  ...args: Parameters<
    ReturnType<typeof createAllApis>["useWaiterGetProductsQuery"]
  >
) => getApiInstances().useWaiterGetProductsQuery(...args);
export const useLazyGetOrderQuery = () =>
  getApiInstances().useLazyGetOrderQuery();
export const useGetOrdersQuery = (
  ...args: Parameters<ReturnType<typeof createAllApis>["useGetOrdersQuery"]>
) => getApiInstances().useGetOrdersQuery(...args);
export const useGetBillsQuery = (
  ...args: Parameters<ReturnType<typeof createAllApis>["useGetBillsQuery"]>
) => getApiInstances().useGetBillsQuery(...args);
export const useLazyGetBillsQuery = () =>
  getApiInstances().useLazyGetBillsQuery();
export const useDeliverMutation = () => getApiInstances().useDeliverMutation();
export const useCreateWaiterBillMutation = () =>
  getApiInstances().useCreateWaiterBillMutation();
export const useGoToTableMutation = () =>
  getApiInstances().useGoToTableMutation();
export const usePayBillMutation = () => getApiInstances().usePayBillMutation();
export const useWaiterCreateOrderMutation = () =>
  getApiInstances().useWaiterCreateOrderMutation();
