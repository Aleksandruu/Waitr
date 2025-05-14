import express, { Request, Response } from "express";
import { Pool } from "pg";
import { checkWaiterRole } from "../middleware/roleMiddleware";
import { authenticateToken } from "../middleware/authMiddleware";
import { getLocationFromRequest } from "../middleware/managerMiddleware";
import { OrderResponseDto } from "shared/dtos/waiter/orderResponse.dto";
import { ProductStatus, TableQueueJsonModel } from "shared";
import { TableStatus } from "shared";

const router = express.Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

const statusPriority: ProductStatus[] = [
  "ready",
  "barista",
  "barman",
  "cook",
  "delivered",
  "payed",
];

router.get(
  "/tables",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    const locationId = getLocationFromRequest(req);

    try {
      const totalTablesQuery = await pool.query(
        "SELECT tables FROM public.Location WHERE id = $1",
        [locationId]
      );

      const totalTables = totalTablesQuery.rows[0]?.tables;
      if (!totalTables) {
        res.status(404).json({ error: "Location not found or has no tables" });
        return;
      }

      const tableQueueQuery = await pool.query<{
        tables_queue: TableQueueJsonModel;
      }>("SELECT tables_queue FROM public.Location WHERE id = $1", [
        locationId,
      ]);

      if (tableQueueQuery.rows.length === 0) {
        res.status(404).json({ error: "Location not found" });
        return;
      }

      const tableQueue = tableQueueQuery.rows[0].tables_queue;

      const tableStatusQueue: TableStatus[] = [];

      tableQueue.ready.forEach((table) => {
        return tableStatusQueue.push({ tableNumber: table, status: "ready" });
      });
      tableQueue.preparing.forEach((table) => {
        return tableStatusQueue.push({
          tableNumber: table,
          status: "preparing",
        });
      });
      tableQueue.delivered.forEach((table) => {
        return tableStatusQueue.push({
          tableNumber: table,
          status: "delivered",
        });
      });
      tableQueue.payed.forEach((table) => {
        return tableStatusQueue.push({ tableNumber: table, status: "payed" });
      });

      res.status(200).json(tableStatusQueue);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/orders",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);
      const totalTablesQuery = await pool.query(
        "SELECT tables FROM public.Location WHERE id = $1",
        [locationId]
      );
      const totalTables = totalTablesQuery.rows[0]?.tables;

      const ordersDtoQuery = await pool.query(
        `SELECT 
          o.table_number AS "table",
          p.id AS "productId",
          p.name,
          p.price,
          op.created_at AS "orderTime",
          op.status AS "status",
          op.quantity
        FROM 
          public.Order o
        JOIN 
          public.ProductOrder op ON o.id = op.order_id
        JOIN 
          public.Product p ON op.product_id = p.id
        WHERE 
          o.location_id = $1
        ORDER BY 
          o.table_number, o.order_time DESC;`,
        [locationId]
      );

      const ordersMap = new Map<number, OrderResponseDto>();

      ordersDtoQuery.rows.forEach((row) => {
        const product = {
          productId: row.productId,
          name: row.name,
          price: row.price,
          status: row.status,
          orderTime: row.orderTime,
          quantity: row.quantity,
        };

        if (!ordersMap.has(row.table)) {
          ordersMap.set(row.table, { table: row.table, products: [] });
        }

        ordersMap.get(row.table)!.products.push(product);
      });

      ordersMap.forEach((order) => {
        order.products.sort(
          (a, b) =>
            statusPriority.indexOf(a.status) - statusPriority.indexOf(b.status)
        );
      });

      const orders = Array.from(ordersMap.values());

      const ordersResponse: OrderResponseDto[] = Array.from(
        { length: totalTables },
        (_, i) => ({
          table: i + 1,
          products:
            orders.find((order) => order.table === i + 1)?.products || [],
        })
      );
      res.status(200).json(ordersResponse);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/order/:tableNumber",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);
      const tableNumber = parseInt(req.params.tableNumber, 10);

      const orderQuery = await pool.query(
        `
        SELECT 
            p.id AS "productId",
            p.name,
            p.price,
            op.created_at AS "orderTime",
            op.status AS "status",
            op.quantity
        FROM 
            public.Order o
        JOIN 
            public.ProductOrder op ON o.id = op.order_id
        JOIN 
            public.Product p ON op.product_id = p.id
        WHERE 
            o.location_id = $1 AND o.table_number = $2
        ORDER BY 
            o.order_time DESC;
        `,
        [locationId, tableNumber]
      );

      if (orderQuery.rows.length === 0) {
        res.status(200).json([]);
        return;
      }

      const orderResponse: OrderResponseDto = {
        table: isNaN(tableNumber) ? 0 : tableNumber,
        products: orderQuery.rows.map((row) => ({
          productId: row.productId,
          name: row.name,
          price: row.price,
          status: row.status,
          orderTime: row.orderTime,
          quantity: row.quantity,
        })),
      };

      orderResponse.products.sort(
        (a, b) =>
          statusPriority.indexOf(a.status) - statusPriority.indexOf(b.status)
      );

      res.status(200).json(orderResponse);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
