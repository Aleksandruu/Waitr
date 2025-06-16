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
  "billed",
  "payed",
];

const normalizeStatus = (status: ProductStatus): OrderStatus => {
  if (["cook", "barista", "barman"].includes(status)) return "preparing";
  return status as OrderStatus;
};

const getStatusAndOldestTime = (
  order: OrderResponseDto
): {
  status: OrderStatus;
  time: number;
} => {
  // Initialize with default values
  let oldestTime = Infinity;
  let resultStatus: OrderStatus = "payed";

  // Check all statuses and find the oldest timestamp
  for (const status of statusPriority) {
    // Check waiter called status (maps to "ready")
    if (status === "ready" && order.waiterCalledAt) {
      const waiterCalledTime = new Date(order.waiterCalledAt).getTime();
      if (waiterCalledTime < oldestTime) {
        oldestTime = waiterCalledTime;
        resultStatus = "ready";
      }
    }

    // Check products with this status
    const filteredProducts = order.products.filter(
      (p) => normalizeStatus(p.status) === status
    );

    if (filteredProducts.length > 0) {
      const oldestProductTime = filteredProducts.reduce((min, p) => {
        const time = new Date(p.orderTime).getTime();
        return Math.min(min, time);
      }, Infinity);

      if (oldestProductTime < oldestTime) {
        oldestTime = oldestProductTime;
        resultStatus = status;
      }
    }

    // Check bills (for "billed" status)
    if (status === "billed" && order.bills && order.bills.length > 0) {
      const oldestBillTime = order.bills.reduce((min, bill) => {
        const time = new Date(bill.createdAt).getTime();
        return Math.min(min, time);
      }, Infinity);

      if (oldestBillTime < oldestTime) {
        oldestTime = oldestBillTime;
        resultStatus = "billed";
      }
    }
  }

  // If no relevant status was found, return default
  if (oldestTime === Infinity) {
    return { status: "payed", time: Infinity };
  }

  return { status: resultStatus, time: oldestTime };
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
      sortKey: statusIndex * 1e15 + time, // status ordonare + timp
    };
  });

  mapped.sort((a, b) => a.sortKey - b.sortKey);

  return mapped.map(({ tableNumber, status }) => ({
    tableNumber,
    status,
  }));
};
