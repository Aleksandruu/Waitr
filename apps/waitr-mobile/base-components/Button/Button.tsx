import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";

interface ButtonProps {
  text: string;
  onPress?: () => void;
  color?:
    | "green"
    | "yellow"
    | "orange"
    | "red"
    | "brand"
    | "brand-light"
    | "brand-dark";
  wide?: boolean;
  wider?: boolean;
  tall?: boolean;
  disabled?: boolean;
  loading?: boolean;
  textWrap?: boolean;
  borderRadius?: "none" | "small" | "medium" | "round";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onPress,
  color = "green",
  wide = false,
  wider = false,
  tall = false,
  disabled = false,
  loading = false,
  textWrap = false,
  borderRadius = "round",
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled || loading) return colors.disabled;
    switch (color) {
      case "green":
        return colors.green;
      case "yellow":
        return colors.yellow;
      case "orange":
        return colors.orange;
      case "red":
        return colors.red;
      case "brand":
        return colors.brand;
      case "brand-light":
        return colors.brandLight;
      case "brand-dark":
        return colors.brandDark;
      default:
        return colors.green;
    }
  };

  const getBorderRadius = () => {
    switch (borderRadius) {
      case "none":
        return 0;
      case "small":
        return 4;
      case "medium":
        return 8;
      case "round":
        return 24;
      default:
        return 24;
    }
  };

  const getButtonStyle = (): ViewStyle => ({
    ...styles.button,
    backgroundColor: getBackgroundColor(),
    borderRadius: getBorderRadius(),
    ...(wide && styles.wide),
    ...(wider && styles.wider),
    ...(tall && styles.tall),
    opacity: disabled || loading ? 0.6 : 1,
  });

  const getTextStyle = (): TextStyle => ({
    ...styles.text,
    ...(tall && styles.tallText),
    ...(textWrap && styles.textWrap),
  });

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const colors = {
  green: "#28b012",
  yellow: "#ffd600",
  orange: "orange",
  red: "#fd0000",
  brand: "#086400",
  brandLight: "#4a9c3a",
  brandDark: "#054200",
  disabled: "gray",
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    width: 120,
  },
  text: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  wide: {
    minWidth: 200,
  },
  wider: {
    minWidth: 300,
  },
  tall: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  tallText: {
    fontSize: 18,
  },
  textWrap: {
    flexWrap: "wrap",
  },
});

export default Button;
