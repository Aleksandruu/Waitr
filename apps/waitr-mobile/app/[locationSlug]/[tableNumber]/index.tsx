import { View, Text, StyleSheet } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";

export default function QRMenuScreen() {
  const { locationSlug, tableNumber } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Link href={"/dashboard"}>
        <Text>
          {locationSlug}---{tableNumber}
        </Text>
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
