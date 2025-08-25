"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBaseApi = void 0;
const react_1 = require("@reduxjs/toolkit/query/react");
const createBaseApi = (config) => {
    const baseQuery = (0, react_1.fetchBaseQuery)({
        baseUrl: config.baseUrl,
        prepareHeaders: (headers, api) => {
            let token = null;
            if (config.platform === "web" && api.getState) {
                token = config.getAuthToken(api.getState);
            }
            else if (config.platform === "mobile") {
                token = config.getAuthToken();
            }
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }
            if (config.customHeaders) {
                Object.entries(config.customHeaders).forEach(([key, value]) => {
                    headers.set(key, value);
                });
            }
            return headers;
        },
    });
    return (0, react_1.createApi)({
        baseQuery: baseQuery,
        tagTypes: [
            "Locations",
            "Staff",
            "Settings",
            "Order",
            "Categories",
            "Products",
            "CalledWaiter",
            "Bill",
        ],
        endpoints: () => ({}),
    });
};
exports.createBaseApi = createBaseApi;
