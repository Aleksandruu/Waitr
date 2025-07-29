"use client"; // This is a client component 👈🏽

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../../base_components/Button/Button";
import { useLoginMutation } from "../../api/authApi";
import Input from "../../base_components/Input/Input";
import { LoginRequest } from "types";
import { classNames } from "../../helpers/className";
import styles from "./Login.module.scss";

const Login = () => {
  const router = useRouter();
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
    <div className={classNames("container", styles.loginContainer)}>
      <form className="middle-column-container justify-center">
        <Input
          name="username"
          label="Username"
          onChange={handleChange}
          error={isError ? "" : undefined}
        ></Input>
        <Input
          name="password"
          label="Password"
          type="password"
          onChange={handleChange}
          error={isError ? "Username or password are wrong" : undefined}
        ></Input>
        <Button
          text="Login"
          color="green"
          wide={true}
          tall={true}
          loading={isLoading}
          onClick={async () => {
            await login(formState);
            router.push("/dashboard");
          }}
          submit={true}
        ></Button>
      </form>
    </div>
  );
};

export default Login;
