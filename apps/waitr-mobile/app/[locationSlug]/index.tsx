import { View, Text, StyleSheet } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";

export default function LocationScreen() {
  const { locationSlug } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <Link href={"/dashboard"}>
        <Text>{locationSlug}</Text>
      </Link>
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
