import {
  StaffMember,
  UpdateLocationSettingsDto,
  LocationSettingsDto,
  LocationResponseDto,
  StaffMemberRequest,
  CategoryModel,
  CreateProductDto,
  ManagerProductResponseDto,
  ManagerProductDetailsDto,
} from "../types";

export const createManagerApi = (api: any) =>
  api.injectEndpoints({
    endpoints: (build: any) => ({
      getStaff: build.query({
        query: () => "manager/employee",
        providesTags: ["Staff"],
      }),
      createStaff: build.mutation({
        query: (staff: StaffMemberRequest) => ({
          url: "manager/employee",
          method: "POST",
          body: staff,
        }),
        invalidatesTags: ["Staff"],
      }),
      createCategory: build.mutation({
        query: (category: { name: string }) => ({
          url: "manager/category",
          method: "POST",
          body: category,
        }),
        invalidatesTags: ["Categories"],
      }),
      deleteCategory: build.mutation({
        query: (categoryId: string) => ({
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
        query: (slug?: string) => `common/location/settings/${slug}`,
        providesTags: ["Settings"],
      }),
      updateSettings: build.mutation({
        query: (settings: UpdateLocationSettingsDto) => {
          const formData = new FormData();
          formData.append("name", settings.name);
          formData.append("slug", settings.slug);
          formData.append("color", settings.color!);
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
        query: (id: string) => `manager/product/${id}`,
        providesTags: (result: any, error: any, id: string) => [
          { type: "Products", id },
        ],
      }),
      createProduct: build.mutation({
        query: (product: CreateProductDto) => {
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
        query: (product: CreateProductDto & { id: string }) => {
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
        query: (productId: string) => ({
          url: `manager/product/${productId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Products"],
      }),
    }),
  });
