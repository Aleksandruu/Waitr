import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "waitr-fe/src/base_components/Input/Input";
import Button from "waitr-fe/src/base_components/Button/Button";
import styles from "./CreateCategory.module.scss";
import { useCreateCategoryMutation } from "waitr-fe/src/api/managerApi";

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

  const [createCategory] = useCreateCategoryMutation();

  const onSubmit = async (data: FormData) => {
    await createCategory({ name: data.name }).unwrap();
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
        />
      </form>
    </div>
  );
};

export default CreateCategory;
