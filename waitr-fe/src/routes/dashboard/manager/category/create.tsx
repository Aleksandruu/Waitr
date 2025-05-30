import { createFileRoute } from "@tanstack/react-router";
import CreateCategory from "waitr-fe/src/pages/Dashboard/Manager/CreateCategory/CreateCategory";

export const Route = createFileRoute("/dashboard/manager/category/create")({
  component: CreateCategory,
});
