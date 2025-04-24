import * as yup from "yup";
import Input from "../../../../base_components/Input/Input";
import Select from "../../../../base_components/Select/Select";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "../../../../base_components/Button/Button";
import { useCreateStaffMutation } from "../../../../api/managerApi";
import { useNavigate } from "@tanstack/react-router";
import { Role } from "shared/models/role.model";

const roles: Role[] = ["waiter", "cook", "barman", "barista"];

const staffSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be at most 50 characters"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  role: yup.string().required("Role is required").oneOf(roles),
});

type FormData = yup.InferType<typeof staffSchema>;

type CreateStaffProps = {
  // props here
};

const CreateStaff = ({}: CreateStaffProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<FormData>({
    resolver: yupResolver(staffSchema),
    mode: "onChange",
  });

  const [createStaff, { isLoading }] = useCreateStaffMutation();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    await createStaff(data).unwrap();
    navigate({ to: "/dashboard/manager" });
  };

  return (
    <div className="container">
      <form
        className="middle-column-container"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1>Add new member</h1>
        <Input
          label="Username"
          register={register("username")}
          error={isDirty ? errors.username?.message : undefined}
        ></Input>
        <Input
          label="Password"
          register={register("password")}
          type="password"
          error={isDirty ? errors.password?.message : undefined}
        ></Input>
        <Input
          label="Confirm Password"
          register={register("confirmPassword")}
          type="password"
          error={isDirty ? errors.confirmPassword?.message : undefined}
        ></Input>
        <Select
          label="Role"
          options={[
            { value: "waiter", label: "Waiter" },
            { value: "cook", label: "Cook" },
            { value: "barman", label: "Barman" },
            { value: "barista", label: "Barista" },
          ]}
          placeholder="Select role"
          register={register("role")}
        ></Select>
        <Button
          text="Create Staff"
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

export default CreateStaff;
