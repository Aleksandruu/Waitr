import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { LoginRequest, ProductResponseDto, Role } from "types";

export default function App() {
  // Example usage of shared types
  const exampleLoginRequest: LoginRequest = {
    username: "use",
    password: "password123",
  };

  const exampleProduct: ProductResponseDto = {
    id: "1",
    name: "Sample Product",
    price: 9.99,
    ingredients: "",
    nutrients: "",
    allergens: "",
  };

  const userRole: Role = "admin";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waitr Mobile App</Text>
      <Text style={styles.subtitle}>Using Shared Types</Text>
      <Text style={styles.info}>User Role: {userRole}</Text>
      <Text style={styles.info}>Sample Product: {exampleProduct.name}</Text>
      <Text style={styles.info}>Price: ${exampleProduct.price}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
});
