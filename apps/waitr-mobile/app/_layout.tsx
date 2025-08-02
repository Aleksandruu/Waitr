import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {},
        headerTintColor: "black",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "black",
        },
      }}
    >
      <Stack.Screen name="asd" />
      <Stack.Screen name="details" />
    </Stack>
  );
}
