import { createFileRoute } from "@tanstack/react-router";
import LocationSettings from "apps/waitr-web/src/pages/Dashboard/Manager/LocationSettings/LocationSettings";

export const Route = createFileRoute("/dashboard/manager/location-setup")({
  component: LocationSettings,
});
