"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStaffApi = void 0;
const createStaffApi = (api) => api.injectEndpoints({
    endpoints: (build) => ({
        getStaffProducts: build.query({
            query: () => "staff/products",
            providesTags: ["Staff"],
        }),
        markProductReady: build.mutation({
            query: (data) => ({
                url: "staff/ready",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Staff"],
        }),
    }),
});
exports.createStaffApi = createStaffApi;
