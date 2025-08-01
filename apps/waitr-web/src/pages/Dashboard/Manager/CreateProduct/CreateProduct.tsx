import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "apps/waitr-web/src/base_components/Input/Input";
import Button from "apps/waitr-web/src/base_components/Button/Button";
import styles from "./CreateCategory.module.scss";
import {
  useCreateProductMutation,
  useGetCategoriesQuery,
  useUpdateProductMutation,
} from "@/api/managerApi";
import Select from "apps/waitr-web/src/base_components/Select/Select";
import ImageInput from "apps/waitr-web/src/base_components/ImageInput/ImageInput";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ManagerProductDetailsDto } from "types";

type CreateProductProps = {
  product?: ManagerProductDetailsDto;
  isEditing?: boolean;
};

const statusOptions = [
  { value: "cook", label: "Bucătar" },
  { value: "barman", label: "Barman" },
  { value: "barista", label: "Barista" },
  { value: "ready", label: "Gata de servit" },
];

const schema = yup.object({
  name: yup.string().required("Numele produsului este obligatoriu"),
  ingredients: yup.string().required("Ingredientele sunt obligatorii"),
  nutrients: yup.string().required("Valorile nutritive sunt obligatorii"),
  allergens: yup.string().required("Alergenii sunt obligatorii"),
  price: yup
    .number()
    .required("Prețul este obligatoriu")
    .positive("Prețul trebuie să fie pozitiv"),
  categoryId: yup
    .string()
    .notOneOf(["0"], "Categoria este obligatorie")
    .required("Categoria este obligatorie"),
  initialStatus: yup
    .string()
    .oneOf(["cook", "barman", "barista", "ready"], "Status invalid")
    .required("Statusul inițial este obligatoriu"),
});

type FormData = yup.InferType<typeof schema>;

const CreateProduct = ({ product, isEditing = false }: CreateProductProps) => {
  const [photo, setPhoto] = useState<File | undefined>(undefined);

  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: product
      ? {
          name: product.name,
          ingredients: product.ingredients,
          nutrients: product.nutrients,
          allergens: product.allergens,
          price: product.price,
          categoryId: product.category_id,
          initialStatus: product.initial_status,
        }
      : undefined,
  });

  const [createProduct, { isLoading: isCreateLoading }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdateLoading }] =
    useUpdateProductMutation();

  const isLoading = isCreateLoading || isUpdateLoading;

  const router = useRouter();
  const onSubmit = async (data: FormData) => {
    if (isEditing && product) {
      await updateProduct({ id: product.id, photo: photo, ...data }).unwrap();
    } else {
      await createProduct({ photo: photo, ...data }).unwrap();
    }
    router.push("/dashboard/manager");
  };

  return (
    <div className="container">
      <form
        className="middle-column-container"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>{isEditing ? "Editează produsul" : "Creaza produs nou"}</h1>
        <Input
          name="name"
          label="Nume"
          type="text"
          register={register("name")}
          error={errors.name?.message}
        />
        <Input
          name="price"
          label="Pret"
          type="number"
          register={register("price")}
          error={errors.price?.message}
        />

        <Select
          name="categoryId"
          label="Categoria"
          options={[
            { value: "0", label: "Alegeti categoria" },
            ...(categories?.map((category) => ({
              value: category.id,
              label: category.name,
            })) || []),
          ]}
          register={register("categoryId")}
          error={errors.categoryId?.message}
        />

        <Select
          name="initialStatus"
          label="Status initial"
          options={statusOptions}
          register={register("initialStatus")}
          error={errors.initialStatus?.message}
        />

        <Input
          name="ingredients"
          label="Ingredients"
          register={register("ingredients")}
          error={errors.ingredients?.message}
        />

        <Input
          name="nutrients"
          label="Nutrients"
          register={register("nutrients")}
          error={errors.nutrients?.message}
        />

        <Input
          name="allergens"
          label="Allergens"
          register={register("allergens")}
          error={errors.allergens?.message}
        />

        <ImageInput
          name="Imagine produs"
          small="Încărcați o imagine pentru produs (opțional)"
          onChange={(file) => setPhoto(file)}
          initialImage={photo}
          initialImageUrl={product?.photo_url}
        />

        <Button
          text={isEditing ? "Salvează modificările" : "Creează produs"}
          color="brand"
          submit
          tall
          wide
          disabled={!isValid}
          loading={isLoading}
        />
      </form>
    </div>
  );
};

export default CreateProduct;
