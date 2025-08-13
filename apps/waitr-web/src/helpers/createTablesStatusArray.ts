import {
  OrderResponseDto,
  OrderStatus,
  ProductStatus,
  TableStatus,
} from "shared";

const statusPriority: OrderStatus[] = [
  "billed",
  "ready",
  "preparing",
  "delivered",
  "payed",
];

const normalizeStatus = (status: ProductStatus): OrderStatus => {
  if (["cook", "barista", "barman"].includes(status)) return "preparing";
  if (status === "billed") return "ready";
  return status as OrderStatus;
};

const getStatusAndOldestTime = (
  order: OrderResponseDto
): {
  status: OrderStatus;
  time: number;
} => {
  for (const status of statusPriority) {
    if (status === "ready" && order.waiterCalledAt) {
      const waiterCalledTime = new Date(order.waiterCalledAt).getTime();
      return { status: "ready", time: waiterCalledTime };
    }

    const filteredProducts = order.products.filter(
      (p) => normalizeStatus(p.status) === status
    );

    if (filteredProducts.length > 0) {
      const oldestProductTime = filteredProducts.reduce((min, p) => {
        const time = new Date(p.orderTime).getTime();
        return Math.min(min, time);
      }, Infinity);

      return { status, time: oldestProductTime };
    }
  }

  return { status: "payed", time: Infinity };
};

export const mapAndSortTablesByStatus = (
  orders: OrderResponseDto[]
): TableStatus[] => {
  const mapped: (TableStatus & { sortKey: number })[] = orders.map((order) => {
    const { status, time } = getStatusAndOldestTime(order);
    const statusIndex = statusPriority.indexOf(status);
    return {
      tableNumber: order.table,
      status,
      sortKey: statusIndex * 1e15 + time,
    };
  });

  mapped.sort((a, b) => a.sortKey - b.sortKey);

  return mapped.map(({ tableNumber, status }) => ({
    tableNumber,
    status,
  }));
};
