import React from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Input from "../../base-components/Input";
import Button from "../../base-components/Button";
import { useLoginMutation } from "../../api/authApi";
import { LoginRequest } from "shared";

// Validation schema with yup
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [login, { isLoading, isError }] = useLoginMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
    defaultValues: { username: "", password: "" },
    mode: "onSubmit",
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      await login(data).unwrap();
      // On successful login, navigate to dashboard
      router.replace("/dashboard");
    } catch (_) {
      // isError will be true, field errors already handled below
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, value } }) => (
            <Input
              name="username"
              label="Username"
              placeholder="Enter username"
              value={value}
              onChangeText={onChange}
              borderRadius="small"
              // show validation border or generic error border
              error={errors.username?.message || (isError ? "" : undefined)}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <Input
              name="password"
              label="Password"
              placeholder="Enter password"
              value={value}
              onChangeText={onChange}
              secureTextEntry
              borderRadius="small"
              error={
                errors.password?.message ||
                (isError ? "Username or password are wrong" : undefined)
              }
            />
          )}
        />

        <Button
          text="Login"
          color="green"
          wide
          tall
          borderRadius="none"
          loading={isLoading}
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  form: {
    gap: 16, // RN 0.79 supports gap in Flexbox
    alignItems: "center",
  },
});

export default LoginScreen;
