import { createFileRoute } from "@tanstack/react-router";
import Admin from "../pages/dashboard/admin/Admin";

export const Route = createFileRoute("/admin")({
  component: Admin,
});
