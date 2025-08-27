import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import LoginScreen from "../screens/Login/LoginScreen";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <LoginScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
