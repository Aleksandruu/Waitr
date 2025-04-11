import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Button from "../../base_components/button/Button";
import { useLoginMutation } from "../../api/authApi";
import { LoginRequest } from "../../models/login.model";
import TextInput from "../../base_components/textInput/TextInput";

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

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
        <TextInput
          label="Username"
          onChange={handleChange}
          error={false}
        ></TextInput>
        <TextInput
          label="Password"
          type="password"
          onChange={handleChange}
          error={false}
        ></TextInput>
        <Button
          text="Login"
          color="green"
          wide={true}
          tall={true}
          loading={isLoading}
          onClick={async () => {
            try {
              const data = await login(formState).unwrap();
              console.log(data);
              navigate({ to: "/dashboard" });
            } catch (err) {}
          }}
        ></Button>
      </form>
    </div>
  );
};

export default Login;
