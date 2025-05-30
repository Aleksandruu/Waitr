import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import BottomBar from "../pages/Customer/BottomBar/BottomBar";
import Navbar from "../pages/Customer/Navbar/Navbar";
import { useGetLocationSettingsQuery } from "../api/managerApi";

export const Route = createFileRoute("/$locationSlug")({
  component: RouteComponent,
});

function RouteComponent() {
  const { locationSlug } = useParams({ strict: false });
  useGetLocationSettingsQuery(locationSlug);

  return (
    <>
      <Navbar />
      <Outlet />
      <BottomBar />
    </>
  );
}
