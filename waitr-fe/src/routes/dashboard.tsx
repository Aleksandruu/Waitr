import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import Navbar from "../pages/Dashboard/navbar/Navbar";
import { store } from "../store";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async (route) => {
    const token = store.getState().auth.token;
    const user = store.getState().auth.user;
    const role = user?.role;

    if (!token) {
      return redirect({
        to: "/login",
        search: { redirectTo: "/dashboard" },
      });
    }
    if (route.location.href === "/dashboard") {
      switch (role) {
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
  return (
    <>
      <Navbar></Navbar>
      <Outlet />
    </>
  );
}
