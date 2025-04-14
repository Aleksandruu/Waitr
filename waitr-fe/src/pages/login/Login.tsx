import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Button from "../../base_components/button/Button";
import { useLoginMutation } from "../../api/authApi";
import { LoginRequest } from "../../models/login.model";
import TextInput from "../../base_components/textInput/TextInput";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading, isError }] = useLoginMutation();

  const [formState, setFormState] = useState<LoginRequest>({
    username: "",
    password: "",
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <form className="middle-column-container justify-center">
        {isLoading ? "asdad" : ""}
        {isError ? "fdas" : ""}
        <TextInput
          label="Username"
          onChange={handleChange}
          error={isError}
        ></TextInput>
        <TextInput
          label="Password"
          type="password"
          onChange={handleChange}
          error={isError}
        ></TextInput>
        <Button
          text="Login"
          color="green"
          wide={true}
          tall={true}
          loading={isLoading}
          onClick={async () => {
            await login(formState);
            navigate({ to: "/dashboard" });
          }}
        ></Button>
      </form>
    </div>
  );
};

export default Login;
