import Button from "@/base-components/Button";
import { useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Button
        wider
        tall
        text={"go to dashboard"}
        onPress={() => router.navigate("/dashboard/admin")}
      ></Button>
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
