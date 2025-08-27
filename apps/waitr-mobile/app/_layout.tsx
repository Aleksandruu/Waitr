import { Stack } from "expo-router";
import { Provider } from "react-redux";
import { store } from "../store";
import { useEffect } from "react";
import { useAppDispatch } from "../helpers/app.hooks";
import { hydrateAuth } from "../screens/Login/Auth.slice";

function Bootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);
  return null;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Bootstrap />
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
        <Stack.Screen name="[locationSlug]" options={{ title: "QR Menu" }} />
        <Stack.Screen name="dashboard" options={{ title: "Dashboard" }} />
      </Stack>
    </Provider>
  );
}
