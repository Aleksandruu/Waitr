import { createFileRoute } from "@tanstack/react-router";
import CreateLocation from "../../../../pages/dashboard/admin/CreateLocation/CreateLocation";

export const Route = createFileRoute("/dashboard/admin/location/create")({
  component: CreateLocation,
});
