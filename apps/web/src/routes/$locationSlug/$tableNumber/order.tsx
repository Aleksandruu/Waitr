import { createFileRoute, redirect, useParams } from "@tanstack/react-router";
import Order from "../../../pages/Customer/Order/Order";
import { store } from "../../../store";

export const Route = createFileRoute("/$locationSlug/$tableNumber/order")({
  component: Order,
  beforeLoad: ({ params }) => {
    const state = store.getState();
    const status = state.order.status;

    if (status === "empty") {
      throw redirect({
        to: "/$locationSlug/$tableNumber",
        params: {
          locationSlug: params.locationSlug!,
          tableNumber: params.tableNumber!,
        },
      });
    }
  },
});
