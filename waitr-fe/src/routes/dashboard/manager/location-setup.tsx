import { createFileRoute } from "@tanstack/react-router";
import LocationSettings from "waitr-fe/src/pages/dashboard/Manager/LocationSettings/LocationSettings";

export const Route = createFileRoute("/dashboard/manager/location-setup")({
  component: LocationSettings,
});
