import React from "react";
import { View, Text, StyleSheet } from "react-native";

type InputWrapperProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

const InputWrapper = ({
  label = "",
  error = undefined,
  children,
}: InputWrapperProps) => {
  return (
    <View style={styles.inputLabel}>
      <Text style={styles.label}>{label}:</Text>
      {children}
      {!!error && <Text style={styles.errorMessage}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  label: {
    position: "relative",
    left: 5,
    marginBottom: 4,
  },
  errorMessage: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    width: 200,
  },
});

export default InputWrapper;
