import { createFileRoute } from "@tanstack/react-router";
import Manager from "../../../pages/dashboard/manager/Manager";

export const Route = createFileRoute("/dashboard/manager/")({
  component: Manager,
});
