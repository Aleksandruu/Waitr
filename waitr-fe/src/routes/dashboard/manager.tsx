import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { store } from "../../store";

export const Route = createFileRoute("/dashboard/manager")({
  component: RouteComponent,
  beforeLoad: async () => {
    const role = store.getState().auth.user?.role;
    if (role !== "manager") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
