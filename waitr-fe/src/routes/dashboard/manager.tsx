import { createFileRoute, redirect } from "@tanstack/react-router";
import Manager from "../../pages/dashboard/manager/Manager";
import { RouterContext } from "../..";

export const Route = createFileRoute("/dashboard/manager")({
  component: Manager,
  beforeLoad: async (route) => {
    const context = route.context as RouterContext;
    if (context.auth.getRole() !== "manager") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
