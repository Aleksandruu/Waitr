import { createFileRoute } from "@tanstack/react-router";
import CreateProduct from "apps/waitr-web/src/pages/Dashboard/Manager/CreateProduct/CreateProduct";

export const Route = createFileRoute("/dashboard/manager/product/create")({
  component: CreateProduct,
});
