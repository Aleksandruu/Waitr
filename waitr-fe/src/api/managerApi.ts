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
} from "shared";
import { api } from "./baseApi";

export const managerApi = api.injectEndpoints({
  endpoints: (build) => ({
    getStaff: build.query<StaffMember[], void>({
      query: () => "manager/employee",
      providesTags: ["Staff"],
    }),
    createStaff: build.mutation<void, StaffMemberRequest>({
      query: (staff) => ({
        url: "manager/employee",
        method: "POST",
        body: staff,
      }),
      invalidatesTags: ["Staff"],
    }),
    createCategory: build.mutation<void, { name: string }>({
      query: (category) => ({
        url: "manager/category",
        method: "POST",
        body: category,
      }),
    }),
    deleteCategory: build.mutation<void, string>({
      query: (categoryId) => ({
        url: `manager/category/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
    getCategories: build.query<CategoryModel[], void>({
      query: () => "manager/category",
      providesTags: ["Categories"],
    }),
    getLocation: build.query<LocationResponseDto, void>({
      query: () => "manager/location",
      providesTags: ["Settings"],
    }),
    getLocationSettings: build.query<LocationSettingsDto, string | undefined>({
      query: (slug?) => `common/location/settings/${slug}`,
      providesTags: ["Settings"],
    }),
    updateSettings: build.mutation<void, UpdateLocationSettingsDto>({
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
    getAllProducts: build.query<ManagerProductResponseDto[], void>({
      query: () => "manager/product",
      providesTags: ["Products"],
    }),
    getProductById: build.query<ManagerProductDetailsDto, string>({
      query: (id) => `manager/product/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    createProduct: build.mutation<void, CreateProductDto>({
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
    updateProduct: build.mutation<void, CreateProductDto & { id: string }>({
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
  }),
});

export const {
  useGetStaffQuery,
  useCreateStaffMutation,
  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetLocationQuery,
  useGetLocationSettingsQuery,
  useUpdateSettingsMutation,
  useCreateProductMutation,
  useUpdateProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useDeleteCategoryMutation,
} = managerApi;
