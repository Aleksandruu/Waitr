import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "apps/waitr-web/src/base_components/Input/Input";
import Button from "apps/waitr-web/src/base_components/Button/Button";
import styles from "./CreateCategory.module.scss";
import { useCreateCategoryMutation } from "apps/waitr-web/src/api/managerApi";
import { useNavigate } from "@tanstack/react-router";

type CreateCategoryProps = {
  // props here
};

const categorySchema = yup.object({
  name: yup.string().required("Name is required"),
});

type FormData = yup.InferType<typeof categorySchema>;

const CreateCategory = ({}: CreateCategoryProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(categorySchema),
    mode: "onChange",
  });

  const [createCategory, { isLoading }] = useCreateCategoryMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    await createCategory({ name: data.name }).unwrap();
    navigate({ to: "/dashboard/manager" });
  };

  return (
    <div className="container">
      <form
        className="middle-column-container"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Create Category</h1>
        <Input
          name="name"
          label="Nume"
          type="text"
          register={register("name")}
          error={errors.name?.message}
        />
        <Button
          text="Creaza categorie"
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

export default CreateCategory;
