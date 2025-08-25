"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomerApi = void 0;
const createCustomerApi = (api) => api.injectEndpoints({
    endpoints: (build) => ({
        getProducts: build.query({
            query: (locationSlug) => `customer/${locationSlug}/product`,
        }),
        createOrder: build.mutation({
            query: (order) => {
                return {
                    url: `customer/order/${order.locationSlug}/${order.tableNumber}`,
                    method: "POST",
                    body: order.order,
                };
            },
        }),
        addProductsToOrder: build.mutation({
            query: (order) => {
                return {
                    url: `customer/order/${order.locationSlug}/${order.tableNumber}`,
                    method: "PUT",
                    body: order.order,
                };
            },
        }),
        getCurrentOrder: build.query({
            query: (locationTable) => `customer/order/${locationTable.locationSlug}/${locationTable.table}`,
        }),
        getUnpaidOrder: build.query({
            query: (locationTable) => `customer/unpaid-order/${locationTable.locationSlug}/${locationTable.table}`,
        }),
        callWaiter: build.mutation({
            query: (params) => {
                return {
                    url: `customer/call-waiter/${params.locationSlug}/${params.tableNumber}`,
                    method: "POST",
                };
            },
            invalidatesTags: ["CalledWaiter"],
        }),
        isWaiterCalled: build.query({
            query: (params) => `customer/waiter-called/${params.locationSlug}/${params.table}`,
            providesTags: (result, error, params) => [
                { type: "CalledWaiter" },
            ],
        }),
        createBill: build.mutation({
            query: (params) => {
                return {
                    url: `customer/bill/${params.locationSlug}/${params.tableNumber}`,
                    method: "POST",
                    body: params.bill,
                };
            },
        }),
    }),
});
exports.createCustomerApi = createCustomerApi;
