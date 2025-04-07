import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { RouterContext } from "../..";

export const Route = createFileRoute("/dashboard/cook")({
  component: RouteComponent,
  beforeLoad: async (route) => {
    const context = route.context as RouterContext;
    if (context.auth.getRole() !== "cook") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
