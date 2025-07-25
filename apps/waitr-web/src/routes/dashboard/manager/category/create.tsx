import { createFileRoute } from "@tanstack/react-router";
import CreateCategory from "apps/waitr-web/src/pages/Dashboard/Manager/CreateCategory/CreateCategory";

export const Route = createFileRoute("/dashboard/manager/category/create")({
  component: CreateCategory,
});
