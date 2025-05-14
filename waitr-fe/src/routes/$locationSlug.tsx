import { createFileRoute, Outlet } from "@tanstack/react-router";
import BottomBar from "../pages/Customer/BottomBar/BottomBar";

export const Route = createFileRoute("/$locationSlug")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Outlet></Outlet>
      <BottomBar></BottomBar>
    </>
  );
}
