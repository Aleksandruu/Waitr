import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { RouterContext } from "..";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async (route) => {
    const context = route.context as RouterContext;
    if (!context.auth.token) {
      return redirect({
        to: "/login",
        search: { redirectTo: "/dashboard" },
      });
    }
    if (route.location.href === "/dashboard") {
      switch (context.auth.getRole()) {
        case "admin":
          throw redirect({
            to: "/dashboard/admin",
          });
        case "manager":
          throw redirect({
            to: "/dashboard/manager",
          });
        case "cook":
          throw redirect({
            to: "/dashboard/cook",
          });
        case "waiter":
          throw redirect({
            to: "/dashboard/waiter",
          });
        default:
          throw redirect({
            to: "/",
          });
      }
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
