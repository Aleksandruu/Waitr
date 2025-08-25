"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthApi = void 0;
const createAuthApi = (api) => api.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (credentials) => ({
                url: "auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: [
                "Settings",
                "Staff",
                "Locations",
                "Order",
                "Categories",
                "Products",
                "CalledWaiter",
                "Bill",
            ],
        }),
    }),
});
exports.createAuthApi = createAuthApi;
