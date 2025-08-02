import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Button from "../Button/Button";

type QuantityButtonProps = {
  text: string;
  quantity: number;
  onClick: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  disabled?: boolean;
  color?: "brand" | "yellow";
  tall?: boolean;
  borderRadius?: "none" | "small" | "medium" | "round";
};

const QuantityButton = ({
  quantity,
  onClick,
  onIncrement,
  onDecrement,
  text,
  disabled,
  color = "brand",
  tall = false,
  borderRadius = "round",
}: QuantityButtonProps) => {
  // Helper function to get border radius value based on prop
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

  // Get border color based on color prop
  const getBorderColor = () => {
    return color === "yellow" ? "rgb(129, 129, 0)" : "#007bff"; // Using a default blue for brand
  };

  if (!quantity) {
    // Render a simple button when quantity is 0
    return (
      <Button
        text={"Add"}
        color={color}
        tall={tall}
        borderRadius={borderRadius}
      />
    );
  }

  // Render quantity control when quantity > 0
  return (
    <View
      style={[
        styles.quantityBtn,
        tall && styles.tall,
        { borderRadius: getBorderRadius() },
        { borderColor: getBorderColor() },
      ]}
    >
      <TouchableOpacity
        onPress={onDecrement}
        style={[styles.control, styles.decrement]}
      >
        <Text style={styles.controlText}>-</Text>
      </TouchableOpacity>

      <Text style={[styles.quantityText, tall && styles.textTall]}>
        {quantity}
      </Text>

      <TouchableOpacity
        onPress={disabled ? undefined : onIncrement}
        style={[
          styles.control,
          styles.increment,
          disabled ? styles.disabled : null,
        ]}
      >
        <Text
          style={[styles.controlText, disabled ? styles.disabledText : null]}
        >
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  brandButton: {
    backgroundColor: "#007bff", // Default blue for brand
  },
  yellowButton: {
    backgroundColor: "#ffd700", // Yellow color
  },
  quantityBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    width: 130,
    height: 27,
    overflow: "hidden",
  },
  control: {
    paddingVertical: 4,
    paddingHorizontal: 24,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  controlText: {
    fontSize: 16,
    fontWeight: "700",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "700",
  },
  decrement: {
    // Styles for decrement button
  },
  increment: {
    // Styles for increment button
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: "#8c8c8c",
  },
  tall: {
    height: 45,
  },
  textTall: {
    fontSize: 18,
  },
});

export default QuantityButton;
