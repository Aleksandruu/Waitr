import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { store } from "../../store";
import Waiter from "apps/waitr-web/src/pages/Dashboard/Waiter/Waiter";

export const Route = createFileRoute("/dashboard/waiter")({
  component: Waiter,
  beforeLoad: async () => {
    const role = store.getState().auth.user?.role;
    if (role !== "waiter") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
