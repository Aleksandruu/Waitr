import {
  OrderResponseDto,
  OrderStatus,
  ProductStatus,
  TableStatus,
} from "shared";

const statusPriority: OrderStatus[] = [
  "ready",
  "preparing",
  "delivered",
  "payed",
];

const normalizeStatus = (status: ProductStatus): OrderStatus => {
  if (["cook", "barista", "barman"].includes(status)) return "preparing";
  return status as OrderStatus;
};

const getStatusAndOldestTime = (
  products: OrderResponseDto["products"]
): {
  status: OrderStatus;
  time: number;
} => {
  for (const status of statusPriority) {
    const filtered = products.filter(
      (p) => normalizeStatus(p.status) === status
    );

    if (filtered.length > 0) {
      const oldest = filtered.reduce((min, p) => {
        const time = new Date(p.orderTime).getTime();
        return Math.min(min, time);
      }, Infinity);
      return { status, time: oldest };
    }
  }
  return { status: "payed", time: Infinity };
};

export const mapAndSortTablesByStatus = (
  orders: OrderResponseDto[]
): TableStatus[] => {
  const mapped: (TableStatus & { sortKey: number })[] = orders.map((order) => {
    const { status, time } = getStatusAndOldestTime(order.products);
    const statusIndex = statusPriority.indexOf(status);
    return {
      tableNumber: order.table,
      status,
      sortKey: statusIndex * 1e15 + time, // status ordonare + timp
    };
  });

  mapped.sort((a, b) => a.sortKey - b.sortKey);

  return mapped.map(({ tableNumber, status }) => ({
    tableNumber,
    status,
  }));
};
