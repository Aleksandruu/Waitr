import React from "react";
import { TextInput, StyleSheet } from "react-native";
import InputWrapper from "../InputWrapper/InputWrapper";

interface InputProps {
  name: string;
  placeholder?: string;
  label?: string;
  error?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  borderRadius?: "none" | "small" | "medium" | "round";
}

const Input = ({
  name = "",
  placeholder = "",
  label = "",
  error = undefined,
  value = "",
  onChangeText = () => {},
  secureTextEntry = false,
  keyboardType = "default",
  borderRadius = "round",
}: InputProps) => {
  const getBorderRadiusStyle = () => {
    switch (borderRadius) {
      case "none":
        return styles.borderRadiusNone;
      case "small":
        return styles.borderRadiusSmall;
      case "medium":
        return styles.borderRadiusMedium;
      case "round":
        return styles.borderRadiusRound;
      default:
        return styles.borderRadiusRound;
    }
  };

  return (
    <InputWrapper label={label} error={error}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[
          styles.input,
          error !== undefined && styles.error,
          getBorderRadiusStyle(),
        ]}
      />
    </InputWrapper>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    borderColor: "rgb(173, 173, 173)",
    padding: 0,
    paddingHorizontal: 12,
  },
  error: {
    borderColor: "red",
  },
  borderRadiusNone: {
    borderRadius: 0,
  },
  borderRadiusSmall: {
    borderRadius: 4,
  },
  borderRadiusMedium: {
    borderRadius: 8,
  },
  borderRadiusRound: {
    borderRadius: 20,
  },
});

export default Input;
