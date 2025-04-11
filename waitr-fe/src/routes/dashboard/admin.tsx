import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { store } from "../../store";

export const Route = createFileRoute("/dashboard/admin")({
  component: RouteComponent,
  beforeLoad: async () => {
    const role = store.getState().auth.user?.role;
    if (role !== "admin") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
