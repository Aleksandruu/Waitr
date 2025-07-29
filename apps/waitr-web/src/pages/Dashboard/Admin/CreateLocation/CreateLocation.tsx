import Input from "../../../../base_components/Input/Input";
import Button from "../../../../base_components/Button/Button";
import { useCreateLocationMutation } from "@/api/adminApi";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
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
  tables: yup
    .number()
    .required("Number of tables is required")
    .min(1, "Number of tables must be at least 1")
    .max(1000, "Number of tables must be at most 1000")
    .integer("Number of tables must be an integer"),
});

type FormData = yup.InferType<typeof locationSchema>;

type CreateLocationProps = {};

const CreateLocation = ({}: CreateLocationProps) => {
  const [createLocation, { isLoading }] = useCreateLocationMutation();

  const router = useRouter();

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
    router.push("/dashboard/admin");
  };

  return (
    <div className="container">
      <form
        className="middle-column-container justify-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Create a new location</h1>
        <Input
          name="locationName"
          label="Nume locatie"
          register={register("locationName")}
          error={isDirty ? errors.locationName?.message : undefined}
        ></Input>
        <Input
          name="locationSlug"
          label="Slug locatie (website URL)"
          register={register("locationSlug")}
          error={isDirty ? errors.locationSlug?.message : undefined}
        ></Input>
        <Input
          name="managerUsername"
          label="Nume utilizator manager"
          register={register("managerUsername")}
          error={isDirty ? errors.managerUsername?.message : undefined}
        ></Input>
        <Input
          name="managerPassword"
          label="Parola manager"
          type="password"
          register={register("managerPassword")}
          error={isDirty ? errors.managerPassword?.message : undefined}
        ></Input>
        <Input
          name="tables"
          label="Numar de mese"
          type="number"
          register={register("tables", { valueAsNumber: true })}
          error={isDirty ? errors.tables?.message : undefined}
        ></Input>
        <Button
          text="Creaza locatie"
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
