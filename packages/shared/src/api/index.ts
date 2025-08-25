// Base API configuration
export { createBaseApi, type ApiConfig } from "./baseApi";

// API creators
export { createAdminApi } from "./adminApi";
export { createAuthApi } from "./authApi";
export {
  createCustomerApi,
  type OrderType,
  type CallWaiterType,
  type BillRequestType,
} from "./customerApi";
export { createManagerApi } from "./managerApi";
export { createStaffApi } from "./staffApi";
export { createWaiterApi, type CreateOrderType } from "./waiterApi";

// Import the creators
import { createAdminApi } from "./adminApi";
import { createAuthApi } from "./authApi";
import { createCustomerApi } from "./customerApi";
import { createManagerApi } from "./managerApi";
import { createStaffApi } from "./staffApi";
import { createWaiterApi } from "./waiterApi";

// Utility function to create all APIs at once
export const createAllApis = (baseApi: any) => {
  const adminApi = createAdminApi(baseApi);
  const authApi = createAuthApi(baseApi);
  const customerApi = createCustomerApi(baseApi);
  const managerApi = createManagerApi(baseApi);
  const staffApi = createStaffApi(baseApi);
  const waiterApi = createWaiterApi(baseApi);

  return {
    adminApi,
    authApi,
    customerApi,
    managerApi,
    staffApi,
    waiterApi,
    // Admin hooks
    useGetLocationsQuery: adminApi.useGetLocationsQuery,
    useGetLocationByIdQuery: adminApi.useGetLocationByIdQuery,
    useCreateLocationMutation: adminApi.useCreateLocationMutation,
    useChangeActiveStatusMutation: adminApi.useChangeActiveStatusMutation,
    // Auth hooks
    useLoginMutation: authApi.useLoginMutation,
    // Customer hooks
    useGetProductsQuery: customerApi.useGetProductsQuery,
    useCreateOrderMutation: customerApi.useCreateOrderMutation,
    useGetCurrentOrderQuery: customerApi.useGetCurrentOrderQuery,
    useGetUnpaidOrderQuery: customerApi.useGetUnpaidOrderQuery,
    useAddProductsToOrderMutation: customerApi.useAddProductsToOrderMutation,
    useCallWaiterMutation: customerApi.useCallWaiterMutation,
    useIsWaiterCalledQuery: customerApi.useIsWaiterCalledQuery,
    useCreateBillMutation: customerApi.useCreateBillMutation,
    // Manager hooks
    useGetStaffQuery: managerApi.useGetStaffQuery,
    useCreateStaffMutation: managerApi.useCreateStaffMutation,
    useCreateCategoryMutation: managerApi.useCreateCategoryMutation,
    useGetCategoriesQuery: managerApi.useGetCategoriesQuery,
    useGetLocationQuery: managerApi.useGetLocationQuery,
    useGetLocationSettingsQuery: managerApi.useGetLocationSettingsQuery,
    useUpdateSettingsMutation: managerApi.useUpdateSettingsMutation,
    useCreateProductMutation: managerApi.useCreateProductMutation,
    useUpdateProductMutation: managerApi.useUpdateProductMutation,
    useGetAllProductsQuery: managerApi.useGetAllProductsQuery,
    useGetProductByIdQuery: managerApi.useGetProductByIdQuery,
    useDeleteCategoryMutation: managerApi.useDeleteCategoryMutation,
    useDeleteProductMutation: managerApi.useDeleteProductMutation,
    // Staff hooks
    useLazyGetStaffProductsQuery: staffApi.useLazyGetStaffProductsQuery,
    useMarkProductReadyMutation: staffApi.useMarkProductReadyMutation,
    // Waiter hooks
    useWaiterGetProductsQuery: waiterApi.useWaiterGetProductsQuery,
    useLazyGetOrderQuery: waiterApi.useLazyGetOrderQuery,
    useGetOrdersQuery: waiterApi.useGetOrdersQuery,
    useGetBillsQuery: waiterApi.useGetBillsQuery,
    useLazyGetBillsQuery: waiterApi.useLazyGetBillsQuery,
    useDeliverMutation: waiterApi.useDeliverMutation,
    useCreateWaiterBillMutation: waiterApi.useCreateWaiterBillMutation,
    useGoToTableMutation: waiterApi.useGoToTableMutation,
    usePayBillMutation: waiterApi.usePayBillMutation,
    useWaiterCreateOrderMutation: waiterApi.useWaiterCreateOrderMutation,
  };
};
