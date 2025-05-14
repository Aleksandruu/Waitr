import { createFileRoute } from "@tanstack/react-router";
import Manager from "../../../pages/Dashboard/Manager/Manager";

export const Route = createFileRoute("/dashboard/manager/")({
  component: Manager,
});
