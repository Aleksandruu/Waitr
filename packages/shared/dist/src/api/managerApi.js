"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManagerApi = void 0;
const createManagerApi = (api) => api.injectEndpoints({
    endpoints: (build) => ({
        getStaff: build.query({
            query: () => "manager/employee",
            providesTags: ["Staff"],
        }),
        createStaff: build.mutation({
            query: (staff) => ({
                url: "manager/employee",
                method: "POST",
                body: staff,
            }),
            invalidatesTags: ["Staff"],
        }),
        createCategory: build.mutation({
            query: (category) => ({
                url: "manager/category",
                method: "POST",
                body: category,
            }),
            invalidatesTags: ["Categories"],
        }),
        deleteCategory: build.mutation({
            query: (categoryId) => ({
                url: `manager/category/${categoryId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories"],
        }),
        getCategories: build.query({
            query: () => "manager/category",
            providesTags: ["Categories"],
        }),
        getLocation: build.query({
            query: () => "manager/location",
            providesTags: ["Settings"],
        }),
        getLocationSettings: build.query({
            query: (slug) => `common/location/settings/${slug}`,
            providesTags: ["Settings"],
        }),
        updateSettings: build.mutation({
            query: (settings) => {
                const formData = new FormData();
                formData.append("name", settings.name);
                formData.append("slug", settings.slug);
                formData.append("color", settings.color);
                if (settings.logo) {
                    formData.append("logo", settings.logo);
                }
                return {
                    url: `manager/location/settings`,
                    method: "PATCH",
                    body: formData,
                };
            },
            invalidatesTags: ["Settings"],
        }),
        getAllProducts: build.query({
            query: () => "manager/product",
            providesTags: ["Products"],
        }),
        getProductById: build.query({
            query: (id) => `manager/product/${id}`,
            providesTags: (result, error, id) => [
                { type: "Products", id },
            ],
        }),
        createProduct: build.mutation({
            query: (product) => {
                const formData = new FormData();
                formData.append("name", product.name);
                formData.append("ingredients", product.ingredients);
                formData.append("nutrients", product.nutrients);
                formData.append("allergens", product.allergens);
                formData.append("price", product.price.toString());
                formData.append("categoryId", product.categoryId);
                formData.append("initialStatus", product.initialStatus);
                if (product.photo) {
                    formData.append("photo", product.photo);
                }
                return {
                    url: "manager/product",
                    method: "POST",
                    body: formData,
                };
            },
            invalidatesTags: ["Products"],
        }),
        updateProduct: build.mutation({
            query: (product) => {
                const formData = new FormData();
                formData.append("name", product.name);
                formData.append("ingredients", product.ingredients);
                formData.append("nutrients", product.nutrients);
                formData.append("allergens", product.allergens);
                formData.append("price", product.price.toString());
                formData.append("categoryId", product.categoryId);
                formData.append("initialStatus", product.initialStatus);
                if (product.photo) {
                    formData.append("photo", product.photo);
                }
                return {
                    url: `manager/product/${product.id}`,
                    method: "PUT",
                    body: formData,
                };
            },
            invalidatesTags: ["Products"],
        }),
        deleteProduct: build.mutation({
            query: (productId) => ({
                url: `manager/product/${productId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),
    }),
});
exports.createManagerApi = createManagerApi;
