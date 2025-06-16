import { createFileRoute } from "@tanstack/react-router";
import Payment from "waitr-fe/src/pages/Customer/Payment/Payment";

export const Route = createFileRoute("/$locationSlug/$tableNumber/payment")({
  component: Payment,
});
