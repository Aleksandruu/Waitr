import { createFileRoute } from "@tanstack/react-router";
import Customer from "waitr-fe/src/pages/Customer/ProductsList/ProductsList";

export const Route = createFileRoute("/$locationSlug/$tableNumber/")({
  component: Customer,
});
