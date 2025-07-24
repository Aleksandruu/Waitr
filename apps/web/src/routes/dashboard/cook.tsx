import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { store } from "../../store";
import Staff from "apps/web/src/pages/Dashboard/Staff/Staff";

export const Route = createFileRoute("/dashboard/cook")({
  component: Staff,
  beforeLoad: async () => {
    const role = store.getState().auth.user?.role;
    if (role === "admin" || role === "manager") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
