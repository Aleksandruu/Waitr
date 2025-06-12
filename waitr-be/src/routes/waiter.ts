import express, { Request, Response } from "express";
import { checkWaiterRole } from "../middleware/roleMiddleware";
import { authenticateToken } from "../middleware/authMiddleware";
import { getLocationFromRequest } from "../middleware/managerMiddleware";
import { OrderResponseDto } from "shared/src/dtos/waiter/orderResponse.dto";
import { OrderItemDto, ProductStatus, TableQueueJsonModel } from "shared";
import { TableStatus } from "shared";
import pool from "../db";

const router = express.Router();

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
          op.id,
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
          id: row.id,
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
            op.id,
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
          id: row.id,
        })),
      };

      orderResponse.products.sort(
        (a: OrderItemDto, b: OrderItemDto) =>
          statusPriority.indexOf(a.status) - statusPriority.indexOf(b.status)
      );

      res.status(200).json(orderResponse);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch(
  "/deliver",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const { orderProductId } = req.body;

      if (!orderProductId) {
        res.status(400).json({ error: "orderProductId is required" });
        return;
      }

      // Verifică dacă produsul există și are starea "ready"
      const checkProductQuery = await pool.query(
        `SELECT status FROM public.ProductOrder WHERE id = $1`,
        [orderProductId]
      );

      if (checkProductQuery.rows.length === 0) {
        res.status(404).json({ error: "Product order not found" });
        return;
      }

      const currentStatus = checkProductQuery.rows[0].status;

      // Verifică dacă starea este "ready"
      if (currentStatus !== "ready") {
        res.status(400).json({
          error: `Cannot deliver product. Current status is "${currentStatus}", expected "ready"`,
        });
        return;
      }

      // Actualizează starea la "delivered"
      await pool.query(
        `UPDATE public.ProductOrder SET status = 'delivered' WHERE id = $1`,
        [orderProductId]
      );

      res.status(200).json({
        message: "Product status updated to delivered successfully",
        orderProductId: orderProductId,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.patch(
  "/pay",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const orderProducts = req.body;

      if (!orderProducts || !Array.isArray(orderProducts)) {
        res.status(400).json({ error: "orderProducts array is required" });
        return;
      }

      if (orderProducts.length === 0) {
        res.status(400).json({ error: "orderProducts array cannot be empty" });
        return;
      }

      // Validate each item in the array
      for (const item of orderProducts) {
        if (
          !item.orderProductId ||
          typeof item.quantity !== "number" ||
          item.quantity <= 0
        ) {
          res.status(400).json({
            error:
              "Each orderProduct must have orderProductId (string) and quantity (positive number)",
          });
          return;
        }
      }

      const processedProducts = [];

      for (const { orderProductId, quantity } of orderProducts) {
        // Check if the product exists and get its current status and quantity
        const checkProductQuery = await pool.query(
          `SELECT status, quantity, order_id, product_id, created_at FROM public.ProductOrder WHERE id = $1`,
          [orderProductId]
        );

        if (checkProductQuery.rows.length === 0) {
          res.status(404).json({
            error: `Product order with id ${orderProductId} not found`,
          });
          return;
        }

        const {
          status: currentStatus,
          quantity: currentQuantity,
          order_id,
          product_id,
          created_at,
        } = checkProductQuery.rows[0];

        // Check if status is "delivered"
        if (currentStatus !== "delivered") {
          res.status(400).json({
            error: `Cannot pay for product ${orderProductId}. Current status is "${currentStatus}", expected "delivered"`,
          });
          return;
        }

        // Check if requested quantity is valid
        if (quantity > currentQuantity) {
          res.status(400).json({
            error: `Cannot pay for ${quantity} items of product ${orderProductId}. Only ${currentQuantity} available.`,
          });
          return;
        }

        if (quantity === currentQuantity) {
          // Pay for the entire quantity - just update status
          await pool.query(
            `UPDATE public.ProductOrder SET status = 'payed' WHERE id = $1`,
            [orderProductId]
          );
          processedProducts.push({
            orderProductId,
            action: "updated",
            quantity,
          });
        } else {
          // Partial payment - create new order product for paid quantity and update original
          const remainingQuantity = currentQuantity - quantity;

          // Create new order product for the paid quantity
          const newOrderProductQuery = await pool.query(
            `INSERT INTO public.ProductOrder (order_id, product_id, quantity, status, created_at) 
             VALUES ($1, $2, $3, 'payed', $4) RETURNING id`,
            [order_id, product_id, quantity, created_at]
          );

          const newOrderProductId = newOrderProductQuery.rows[0].id;

          // Update original order product with remaining quantity
          await pool.query(
            `UPDATE public.ProductOrder SET quantity = $1 WHERE id = $2`,
            [remainingQuantity, orderProductId]
          );

          processedProducts.push({
            originalOrderProductId: orderProductId,
            newOrderProductId,
            action: "split",
            paidQuantity: quantity,
            remainingQuantity,
          });
        }
      }

      res.status(200).json({
        message: "Products payment processed successfully",
        processedProducts: processedProducts,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
