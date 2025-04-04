import { createFileRoute, redirect } from "@tanstack/react-router";
import Login from "../pages/login/Login";
import { RouterContext } from "..";

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async (route) => {
    const context = route.context as RouterContext;
    if (context.auth.token) {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
