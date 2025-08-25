export interface ApiConfig {
    baseUrl: string;
    getAuthToken: (getState?: any) => string | null;
    platform: "web" | "mobile";
    customHeaders?: Record<string, string>;
}
export declare const createBaseApi: (config: ApiConfig) => import("@reduxjs/toolkit/query").Api<import("@reduxjs/toolkit/query").BaseQueryFn<string | import("@reduxjs/toolkit/query").FetchArgs, unknown, import("@reduxjs/toolkit/query").FetchBaseQueryError, {}, import("@reduxjs/toolkit/query").FetchBaseQueryMeta>, {}, "api", "Locations" | "Settings" | "Staff" | "Order" | "Categories" | "Products" | "CalledWaiter" | "Bill", typeof import("@reduxjs/toolkit/query").coreModuleName | typeof import("@reduxjs/toolkit/query/react").reactHooksModuleName>;
//# sourceMappingURL=baseApi.d.ts.map