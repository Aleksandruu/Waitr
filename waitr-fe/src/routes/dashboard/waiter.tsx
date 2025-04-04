import { createFileRoute, redirect } from "@tanstack/react-router";
import { RouterContext } from "../..";

export const Route = createFileRoute("/dashboard/waiter")({
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
  return <div>Hello "/dashboard/waiter"!</div>;
}
