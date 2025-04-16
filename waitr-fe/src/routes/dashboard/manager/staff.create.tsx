import { createFileRoute } from "@tanstack/react-router";
import CreateStaff from "../../../pages/dashboard/Manager/CreateStaff/CreateStaff";

export const Route = createFileRoute("/dashboard/manager/staff/create")({
  component: CreateStaff,
});
