import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { store } from "../../store";

export const Route = createFileRoute("/dashboard/cook")({
  component: RouteComponent,
  beforeLoad: async () => {
    const role = store.getState().auth.user?.role;
    if (role !== "cook") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
