import { createFileRoute, redirect } from "@tanstack/react-router";
import Admin from "../../pages/dashboard/admin/Admin";
import { RouterContext } from "../..";

export const Route = createFileRoute("/dashboard/admin")({
  component: Admin,
  beforeLoad: async (route) => {
    const context = route.context as RouterContext;
    if (context.auth.getRole() !== "admin") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
