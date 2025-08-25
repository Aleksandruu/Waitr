"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAllApis = exports.createWaiterApi = exports.createStaffApi = exports.createManagerApi = exports.createCustomerApi = exports.createAuthApi = exports.createAdminApi = exports.createBaseApi = void 0;
// Base API configuration
var baseApi_1 = require("./baseApi");
Object.defineProperty(exports, "createBaseApi", { enumerable: true, get: function () { return baseApi_1.createBaseApi; } });
// API creators
var adminApi_1 = require("./adminApi");
Object.defineProperty(exports, "createAdminApi", { enumerable: true, get: function () { return adminApi_1.createAdminApi; } });
var authApi_1 = require("./authApi");
Object.defineProperty(exports, "createAuthApi", { enumerable: true, get: function () { return authApi_1.createAuthApi; } });
var customerApi_1 = require("./customerApi");
Object.defineProperty(exports, "createCustomerApi", { enumerable: true, get: function () { return customerApi_1.createCustomerApi; } });
var managerApi_1 = require("./managerApi");
Object.defineProperty(exports, "createManagerApi", { enumerable: true, get: function () { return managerApi_1.createManagerApi; } });
var staffApi_1 = require("./staffApi");
Object.defineProperty(exports, "createStaffApi", { enumerable: true, get: function () { return staffApi_1.createStaffApi; } });
var waiterApi_1 = require("./waiterApi");
Object.defineProperty(exports, "createWaiterApi", { enumerable: true, get: function () { return waiterApi_1.createWaiterApi; } });
// Import the creators
const adminApi_2 = require("./adminApi");
const authApi_2 = require("./authApi");
const customerApi_2 = require("./customerApi");
const managerApi_2 = require("./managerApi");
const staffApi_2 = require("./staffApi");
const waiterApi_2 = require("./waiterApi");
// Utility function to create all APIs at once
const createAllApis = (baseApi) => {
    const adminApi = (0, adminApi_2.createAdminApi)(baseApi);
    const authApi = (0, authApi_2.createAuthApi)(baseApi);
    const customerApi = (0, customerApi_2.createCustomerApi)(baseApi);
    const managerApi = (0, managerApi_2.createManagerApi)(baseApi);
    const staffApi = (0, staffApi_2.createStaffApi)(baseApi);
    const waiterApi = (0, waiterApi_2.createWaiterApi)(baseApi);
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
exports.createAllApis = createAllApis;
