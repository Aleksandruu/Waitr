import { Stack } from "expo-router";

export default function DashboardLayout() {
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
      <Stack.Screen name="index" options={{ title: "Dashboard" }} />
      <Stack.Screen name="admin/index" options={{ title: "Admin Dashboard" }} />
      <Stack.Screen
        name="food-beverage/index"
        options={{ title: "Kitchen Dashboard" }}
      />
      <Stack.Screen
        name="manager/index"
        options={{ title: "Manager Dashboard" }}
      />
      <Stack.Screen
        name="waiter/index"
        options={{ title: "Waiter Dashboard" }}
      />
    </Stack>
  );
}
