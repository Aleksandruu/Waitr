import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { RouterContext } from "../..";

export const Route = createFileRoute("/dashboard/manager")({
  component: RouteComponent,
  beforeLoad: async (route) => {
    const context = route.context as RouterContext;
    if (context.auth.getRole() !== "manager") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
