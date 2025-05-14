import { Pool } from "pg";
import { TableQueueJsonModel } from "shared";

interface Fields {
  [key: string]: string | number | boolean;
}

interface Body {
  [key: string]: string | number | boolean;
}

export const validateFields = (fields: Fields, body: Body): void => {
  const fieldNames = Object.keys(fields);
  const missingFields = fieldNames.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
  }
};

export type TableStatusJson = keyof TableQueueJsonModel;

export const moveTableToStatus = async (
  queues: TableQueueJsonModel,
  tableNumber: number,
  locationId: string,
  targetStatus: TableStatusJson,
  pool: Pool
) => {
  if (queues[targetStatus].includes(tableNumber)) {
    return queues;
  }

  const updatedQueues: TableQueueJsonModel = {
    ready: queues.ready.filter((n) => n !== tableNumber),
    preparing: queues.preparing.filter((n) => n !== tableNumber),
    delivered: queues.delivered.filter((n) => n !== tableNumber),
    payed: queues.payed.filter((n) => n !== tableNumber),
  };

  updatedQueues[targetStatus].push(tableNumber);

  await pool.query(
    "UPDATE public.Location SET tables_queue = $1 WHERE id = $2",
    [JSON.stringify(updatedQueues), locationId]
  );

  return updatedQueues;
};
