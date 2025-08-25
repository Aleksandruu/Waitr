"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWaiterApi = void 0;
const createWaiterApi = (api) => api.injectEndpoints({
    endpoints: (build) => ({
        waiterGetProducts: build.query({
            query: () => `waiter/products`,
            providesTags: ["Products"],
        }),
        getOrder: build.query({
            query: (tableNumber) => `waiter/order/${tableNumber}`,
            providesTags: (result, error, tableNumber) => [
                { type: "Order", id: tableNumber },
            ],
        }),
        getOrders: build.query({
            query: () => `waiter/orders`,
            providesTags: [{ type: "Order", id: "LIST" }],
        }),
        getBills: build.query({
            query: (tableNumber) => `waiter/bills/${tableNumber}`,
            providesTags: (result, error, tableNumber) => [
                { type: "Bill", id: tableNumber },
            ],
        }),
        deliver: build.mutation({
            query: ({ orderProductId, tableNumber, }) => ({
                url: `waiter/deliver`,
                method: "PATCH",
                body: { orderProductId },
            }),
            invalidatesTags: (result, error, { tableNumber }) => [{ type: "Order", id: tableNumber }],
        }),
        waiterCreateOrder: build.mutation({
            query: (params) => {
                return {
                    url: `waiter/create-order/${params.table}`,
                    method: "POST",
                    body: { products: params.products },
                };
            },
            invalidatesTags: (result, error, { table }) => [
                { type: "Order", id: table },
                { type: "Order", id: "LIST" },
            ],
        }),
        createWaiterBill: build.mutation({
            query: (productsToPay) => ({
                url: `waiter/create-bill`,
                method: "POST",
                body: {
                    orderProducts: productsToPay,
                    paymentMethod: "cash",
                    tips: 0,
                },
            }),
            invalidatesTags: (result, error, productsToPay) => {
                return [{ type: "Bill" }];
            },
        }),
        goToTable: build.mutation({
            query: (tableNumber) => ({
                url: `waiter/respond-to-call/${tableNumber}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, tableNumber) => [
                { type: "Order" },
            ],
        }),
        payBill: build.mutation({
            query: (billId) => ({
                url: `waiter/pay-bill/${billId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, billId) => [
                { type: "Bill" },
                { type: "Order" },
            ],
        }),
    }),
});
exports.createWaiterApi = createWaiterApi;
