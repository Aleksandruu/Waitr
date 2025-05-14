import { createFileRoute } from "@tanstack/react-router";
import CreateStaff from "../../../pages/Dashboard/Manager/CreateStaff/CreateStaff";

export const Route = createFileRoute("/dashboard/manager/staff/create")({
  component: CreateStaff,
});
