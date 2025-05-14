import { createFileRoute, redirect } from "@tanstack/react-router";
import Login from "../pages/Login/Login";
import { store } from "../store";

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    const token = store.getState().auth.token;
    if (token) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
