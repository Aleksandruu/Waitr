import { createFileRoute } from "@tanstack/react-router";
import Admin from "../../../pages/Dashboard/Admin/Admin";

export const Route = createFileRoute("/dashboard/admin/")({
  component: Admin,
});
