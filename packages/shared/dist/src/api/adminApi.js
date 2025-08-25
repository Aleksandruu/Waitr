"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdminApi = void 0;
const createAdminApi = (api) => api.injectEndpoints({
    endpoints: (build) => ({
        getLocations: build.query({
            query: () => "admin/locations",
            providesTags: ["Locations"],
        }),
        getLocationById: build.query({
            query: (id) => `admin/locations/${id}`,
        }),
        createLocation: build.mutation({
            query: (location) => ({
                url: "admin/locations",
                method: "POST",
                body: location,
            }),
            invalidatesTags: ["Locations"],
        }),
        changeActiveStatus: build.mutation({
            query: ({ id, active }) => ({
                url: `admin/locations/${id}/active`,
                method: "PATCH",
                body: { active },
            }),
            invalidatesTags: ["Locations"],
        }),
    }),
});
exports.createAdminApi = createAdminApi;
