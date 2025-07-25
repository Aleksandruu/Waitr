import { createFileRoute } from "@tanstack/react-router";
import Customer from "apps/waitr-web/src/pages/Customer/ProductsList/ProductsList";

export const Route = createFileRoute("/$locationSlug/$tableNumber/")({
  component: Customer,
});
