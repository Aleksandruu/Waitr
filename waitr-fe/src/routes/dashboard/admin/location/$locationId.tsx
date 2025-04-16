import { createFileRoute } from "@tanstack/react-router";
import LocationPage from "../../../../pages/dashboard/Admin/LocationPage/LocationPage";

export const Route = createFileRoute("/dashboard/admin/location/$locationId")({
  component: LocationPage,
});
