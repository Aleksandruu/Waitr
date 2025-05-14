import Input from "../../../../base_components/Input/Input";
import Button from "../../../../base_components/Button/Button";
import { useCreateLocationMutation } from "../../../../api/adminApi";
import { useNavigate } from "@tanstack/react-router";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const locationSchema = yup.object({
  locationName: yup
    .string()
    .required("Location name is required")
    .min(3, "Location name must be at least 3 characters")
    .max(50, "Location name must be at most 50 characters"),
  locationSlug: yup
    .string()
    .required("Location slug is required")
    .min(3, "Location slug must be at least 3 characters")
    .max(50, "Location slug must be at most 50 characters")
    .matches(
      /^[a-z](?:[a-z]*-?[a-z]+)*[a-z]$/,
      "Location slug can only contain lowercase letters and dashes"
    ),
  managerUsername: yup
    .string()
    .required("Manager username is required")
    .min(3, "Manager username must be at least 3 characters")
    .max(50, "Manager username must be at most 50 characters"),
  managerPassword: yup
    .string()
    .required("Manager password is required")
    .min(8, "Manager password must be at least 8 characters")
    .max(50, "Manager password must be at most 50 characters"),
});

type FormData = yup.InferType<typeof locationSchema>;

type CreateLocationProps = {};

const CreateLocation = ({}: CreateLocationProps) => {
  const [createLocation, { isLoading }] = useCreateLocationMutation();

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(locationSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    await createLocation(data).unwrap();
    navigate({ to: "/dashboard/admin" });
  };

  return (
    <div className="container">
      <form
        className="middle-column-container justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Create a new location</h1>
        <Input
          label="Location name"
          register={register("locationName")}
          error={isDirty ? errors.locationName?.message : undefined}
        ></Input>
        <Input
          label="Location slug"
          register={register("locationSlug")}
          error={isDirty ? errors.locationSlug?.message : undefined}
        ></Input>
        <Input
          label="Manager username"
          register={register("managerUsername")}
          error={isDirty ? errors.managerUsername?.message : undefined}
        ></Input>
        <Input
          label="Manager password"
          type="password"
          register={register("managerPassword")}
          error={isDirty ? errors.managerPassword?.message : undefined}
        ></Input>
        <Button
          text="Create Location"
          wide={true}
          tall={true}
          submit={true}
          loading={isLoading}
          disabled={!isValid}
        ></Button>
      </form>
    </div>
  );
};

export default CreateLocation;
