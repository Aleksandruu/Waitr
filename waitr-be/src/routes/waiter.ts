import express, { Request, Response } from "express";
import { checkWaiterRole } from "../middleware/roleMiddleware";
import { authenticateToken } from "../middleware/authMiddleware";
import { getLocationFromRequest } from "../middleware/managerMiddleware";
import { OrderResponseDto } from "shared/src/dtos/waiter/orderResponse.dto";
import {
  OrderItemDto,
  ProductStatus,
  BillResponseDto,
  BillItemDto,
} from "shared";
import { getIo } from "../sockets";
import pool from "../db";

const router = express.Router();

const statusPriority: ProductStatus[] = [
  "ready",
  "barista",
  "barman",
  "cook",
  "delivered",
  "billed",
  "payed",
];

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

      // First, get all orders with products
      const ordersDtoQuery = await pool.query(
        `SELECT 
          o.table_number AS "table",
          p.id AS "productId",
          p.name,
          p.price,
          op.id,
          op.created_at AS "orderTime",
          op.status AS "status",
          op.quantity,
          o.waiter_called_at,
          o.id AS "orderId"
        FROM 
          public.Order o
        JOIN 
          public.ProductOrder op ON o.id = op.order_id
        JOIN 
          public.Product p ON op.product_id = p.id
        WHERE 
          o.location_id = $1 AND o.active = TRUE
        ORDER BY 
          o.table_number, o.order_time DESC;`,
        [locationId]
      );

      const ordersMap = new Map<number, OrderResponseDto>();

      // Process orders with products
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
          ordersMap.set(row.table, {
            table: row.table,
            products: [],
            bills: [],
            waiterCalledAt: row.waiter_called_at,
          });
        } else if (
          row.waiter_called_at &&
          !ordersMap.get(row.table)!.waiterCalledAt
        ) {
          // If this row has waiter_called_at and the map entry doesn't, update it
          ordersMap.get(row.table)!.waiterCalledAt = row.waiter_called_at;
        }

        ordersMap.get(row.table)!.products.push(product);
      });

      // Now, get all empty orders where waiter has been called
      const emptyOrdersQuery = await pool.query(
        `SELECT 
          id, 
          table_number AS "table", 
          waiter_called_at
        FROM 
          public.Order
        WHERE 
          location_id = $1 
          AND active = TRUE 
          AND waiter_called_at IS NOT NULL
          AND id NOT IN (
            SELECT DISTINCT order_id FROM public.ProductOrder
          )
        ORDER BY 
          table_number;`,
        [locationId]
      );

      // Add empty orders with waiter calls to the map
      emptyOrdersQuery.rows.forEach((row) => {
        if (!ordersMap.has(row.table)) {
          ordersMap.set(row.table, {
            table: row.table,
            products: [],
            bills: [],
            waiterCalledAt: row.waiter_called_at,
          });
        } else if (
          row.waiter_called_at &&
          (!ordersMap.get(row.table)!.waiterCalledAt ||
            new Date(row.waiter_called_at) >
              new Date(ordersMap.get(row.table)!.waiterCalledAt!))
        ) {
          // Update if this empty order has a more recent waiter call
          ordersMap.get(row.table)!.waiterCalledAt = row.waiter_called_at;
        }
      });

      // Sort products by status priority
      ordersMap.forEach((order) => {
        order.products.sort(
          (a, b) =>
            statusPriority.indexOf(a.status) - statusPriority.indexOf(b.status)
        );
      });

      const orders = Array.from(ordersMap.values());

      // Fetch bills for all tables with active orders
      for (const [tableNumber, order] of ordersMap.entries()) {
        try {
          const billsQuery = await pool.query(
            `SELECT 
              b.id, 
              b.order_id, 
              b.payment_method, 
              b.tips, 
              b.total_amount, 
              b.created_at
            FROM 
              public.Bill b
            JOIN 
              public.Order o ON b.order_id = o.id
            WHERE 
              o.location_id = $1 
              AND o.table_number = $2 
              AND o.active = TRUE
              AND b.paid_at IS NULL
            ORDER BY 
              b.created_at DESC`,
            [locationId, tableNumber]
          );

          const bills: BillResponseDto[] = [];

          for (const bill of billsQuery.rows) {
            const billItemsQuery = await pool.query(
              `SELECT 
                bi.id,
                bi.quantity,
                bi.price,
                p.id as product_id,
                p.name
              FROM 
                public.BillItem bi
              JOIN 
                public.ProductOrder po ON bi.product_order_id = po.id
              JOIN 
                public.Product p ON po.product_id = p.id
              WHERE 
                bi.bill_id = $1`,
              [bill.id]
            );

            const billItems: BillItemDto[] = billItemsQuery.rows.map(
              (item) => ({
                id: item.id,
                productId: item.product_id,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
              })
            );

            bills.push({
              id: bill.id,
              tableNumber: tableNumber,
              paymentMethod: bill.payment_method,
              tips: bill.tips,
              totalAmount: bill.total_amount,
              createdAt: bill.created_at,
              items: billItems,
            });
          }

          order.bills = bills;
        } catch (error) {
          console.error(
            `Error fetching bills for table ${tableNumber}:`,
            error
          );
          // Continue with other tables even if one fails
        }
      }

      // Create response for all tables
      const ordersResponse: OrderResponseDto[] = Array.from(
        { length: totalTables },
        (_, i) => {
          const existingOrder = orders.find((order) => order.table === i + 1);
          return {
            table: i + 1,
            products: existingOrder?.products || [],
            bills: existingOrder?.bills || [],
            waiterCalledAt: existingOrder?.waiterCalledAt || null,
          };
        }
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

      // First, check for orders with products
      const orderQuery = await pool.query(
        `
        SELECT 
            p.id AS "productId",
            p.name,
            p.price,
            op.id,
            op.created_at AS "orderTime",
            op.status AS "status",
            op.quantity,
            o.waiter_called_at,
            o.id AS "orderId"
        FROM 
            public.Order o
        JOIN 
            public.ProductOrder op ON o.id = op.order_id
        JOIN 
            public.Product p ON op.product_id = p.id
        WHERE 
            o.location_id = $1 AND o.table_number = $2 AND o.active = TRUE
        ORDER BY 
            o.order_time DESC;
        `,
        [locationId, tableNumber]
      );

      let waiterCalledAt = null;
      let products: OrderItemDto[] = [];

      // If we found orders with products, process them
      if (orderQuery.rows.length > 0) {
        waiterCalledAt = orderQuery.rows[0].waiter_called_at;

        products = orderQuery.rows.map((row) => ({
          productId: row.productId,
          name: row.name,
          price: row.price,
          status: row.status,
          orderTime: row.orderTime,
          quantity: row.quantity,
          id: row.id,
        }));

        products.sort(
          (a: OrderItemDto, b: OrderItemDto) =>
            statusPriority.indexOf(a.status) - statusPriority.indexOf(b.status)
        );
      } else {
        // If no orders with products, check for empty orders with waiter calls
        const emptyOrderQuery = await pool.query(
          `
          SELECT 
              id,
              waiter_called_at
          FROM 
              public.Order
          WHERE 
              location_id = $1 
              AND table_number = $2 
              AND active = TRUE 
              AND waiter_called_at IS NOT NULL
              AND id NOT IN (
                SELECT DISTINCT order_id FROM public.ProductOrder
              )
          ORDER BY 
              waiter_called_at DESC
          LIMIT 1;
          `,
          [locationId, tableNumber]
        );

        if (emptyOrderQuery.rows.length > 0) {
          waiterCalledAt = emptyOrderQuery.rows[0].waiter_called_at;
        } else {
          // No orders at all for this table
          res.status(200).json({
            table: isNaN(tableNumber) ? 0 : tableNumber,
            waiterCalledAt: null,
            products: [],
            bills: [],
          });
          return;
        }
      }

      // Fetch bills for this table
      const billsQuery = await pool.query(
        `SELECT 
          b.id, 
          b.order_id, 
          b.payment_method, 
          b.tips, 
          b.total_amount, 
          b.created_at
        FROM 
          public.Bill b
        JOIN 
          public.Order o ON b.order_id = o.id
        WHERE 
          o.location_id = $1 
          AND o.table_number = $2 
          AND o.active = TRUE
          AND b.paid_at IS NULL
        ORDER BY 
          b.created_at DESC`,
        [locationId, tableNumber]
      );

      const bills: BillResponseDto[] = [];

      for (const bill of billsQuery.rows) {
        const billItemsQuery = await pool.query(
          `SELECT 
            bi.id,
            bi.quantity,
            bi.price,
            p.id as product_id,
            p.name
          FROM 
            public.BillItem bi
          JOIN 
            public.ProductOrder po ON bi.product_order_id = po.id
          JOIN 
            public.Product p ON po.product_id = p.id
          WHERE 
            bi.bill_id = $1`,
          [bill.id]
        );

        const billItems: BillItemDto[] = billItemsQuery.rows.map((item) => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        bills.push({
          id: bill.id,
          tableNumber: tableNumber,
          paymentMethod: bill.payment_method,
          tips: bill.tips,
          totalAmount: bill.total_amount,
          createdAt: bill.created_at,
          items: billItems,
        });
      }

      const orderResponse: OrderResponseDto = {
        table: isNaN(tableNumber) ? 0 : tableNumber,
        waiterCalledAt: waiterCalledAt,
        products: products,
        bills: bills,
      };

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

router.get(
  "/products",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);

      const categoriesWithProductsQuery = await pool.query(
        `
        SELECT 
          c.id AS "categoryId",
          c.name AS "categoryName",
          COALESCE(
            JSON_AGG(
              JSON_BUILD_OBJECT(
                'id', p.id,
                'name', p.name,
                'ingredients', p.ingredients,
                'nutrients', p.nutrients,
                'allergens', p.allergens,
                'price', p.price,
                'photoUrl', p.photo_url
              )
            ) FILTER (WHERE p.id IS NOT NULL), 
            '[]'
          ) AS "products"
        FROM 
          public.Category c
        LEFT JOIN 
          public.Product p
        ON 
          c.id = p.category_id
        WHERE 
          c.location_id = $1
        GROUP BY 
          c.id, c.name, c.location_id;
        `,
        [locationId]
      );

      const categoriesWithProducts = categoriesWithProductsQuery.rows;

      res.status(200).json(categoriesWithProducts);
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/create-order/:table",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);
      const table = parseInt(req.params.table, 10);
      const { products } = req.body;

      if (isNaN(table) || table <= 0) {
        res.status(400).json({ error: "Valid table number is required" });
        return;
      }

      if (!products || !Array.isArray(products) || products.length === 0) {
        res
          .status(400)
          .json({ error: "Products array is required and cannot be empty" });
        return;
      }

      // Validate each product in the array
      const productIds = products.map((p) => p.id);

      // Verify products exist and get their initial statuses
      const productsQuery = await pool.query(
        `SELECT id, initial_status FROM public.Product WHERE id = ANY($1)`,
        [productIds]
      );
      const foundProducts = productsQuery.rows;
      const foundProductIds = foundProducts.map((p) => p.id);

      if (foundProductIds.length < productIds.length) {
        const invalidProductIds = productIds.filter(
          (id: string) => !foundProductIds.includes(id)
        );

        if (invalidProductIds.length > 0) {
          res.status(400).json({
            error: "Invalid product IDs",
            invalidProductIds,
          });
          return;
        }
      }

      // Create a map of product IDs to their initial statuses
      const productStatusMap: { [id: string]: ProductStatus } = {};
      foundProducts.forEach((p) => {
        productStatusMap[p.id] = p.initial_status;
      });

      // Check if there's an existing active order for this table
      const getOrderQuery = await pool.query(
        `SELECT id 
        FROM public.Order 
        WHERE table_number = $1 AND location_id = $2 AND active = TRUE
        LIMIT 1;`,
        [table, locationId]
      );

      let orderId: string = getOrderQuery.rows[0]?.id;

      // If no active order exists, create a new one
      if (!orderId) {
        const orderQuery = await pool.query(
          "INSERT INTO public.order (table_number, location_id) VALUES ($1, $2) RETURNING id",
          [table, locationId]
        );
        orderId = orderQuery.rows[0].id;
      }

      // Add products to the order
      for (const product of products) {
        await pool.query(
          "INSERT INTO public.ProductOrder (order_id, product_id, quantity, status, created_at) VALUES ($1, $2, $3, $4, NOW())",
          [orderId, product.id, product.quantity, productStatusMap[product.id]]
        );
      }

      // Send notifications via socket.io
      const io = getIo();

      // Send pings based on product statuses
      const statusSet = new Set<ProductStatus>();
      products.forEach((product) => {
        const status = productStatusMap[product.id];
        statusSet.add(status);
      });

      statusSet.forEach((status) => {
        if (status !== "ready") {
          io.to(`${status}-${locationId}`).emit("order-ping", {
            table: table,
          });
        }
      });

      // Also notify waiters
      io.to(`waiter-${locationId}`).emit("order-ping", {
        table: table,
      });

      res.status(200).json({ message: "Order created successfully", orderId });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/create-bill",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const { orderProducts, paymentMethod = "cash", tips = 0 } = req.body;

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

      // Start a transaction
      await pool.query("BEGIN");

      const processedProducts = [];
      let totalAmount = tips; // Start with tips as part of the total amount

      // Group products by order_id
      const orderProductsMap = new Map<
        string,
        Array<{
          orderProductId: string;
          quantity: number;
          price: number;
          productId: string;
        }>
      >();

      // First pass: validate all products and group them by order_id
      for (const { orderProductId, quantity } of orderProducts) {
        // Check if the product exists and get its current status and quantity
        const checkProductQuery = await pool.query(
          `SELECT po.status, po.quantity, po.order_id, po.product_id, po.created_at, p.price, o.table_number
           FROM public.ProductOrder po
           JOIN public.Product p ON po.product_id = p.id
           JOIN public.Order o ON po.order_id = o.id
           WHERE po.id = $1`,
          [orderProductId]
        );

        if (checkProductQuery.rows.length === 0) {
          await pool.query("ROLLBACK");
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
          price,
        } = checkProductQuery.rows[0];

        // Check if status is "delivered"
        if (currentStatus !== "delivered") {
          await pool.query("ROLLBACK");
          res.status(400).json({
            error: `Cannot bill product ${orderProductId}. Current status is "${currentStatus}", expected "delivered"`,
          });
          return;
        }

        // Check if requested quantity is valid
        if (quantity > currentQuantity) {
          await pool.query("ROLLBACK");
          res.status(400).json({
            error: `Cannot bill ${quantity} items of product ${orderProductId}. Only ${currentQuantity} available.`,
          });
          return;
        }

        // Add to the order products map
        if (!orderProductsMap.has(order_id)) {
          orderProductsMap.set(order_id, []);
        }

        orderProductsMap.get(order_id)!.push({
          orderProductId,
          quantity,
          price,
          productId: product_id,
        });

        // Add to total amount
        totalAmount += price * quantity;
      }

      // Create a bill for each order
      for (const [orderId, products] of orderProductsMap.entries()) {
        // Get table number for this order
        const orderQuery = await pool.query(
          `SELECT table_number, location_id FROM public.Order WHERE id = $1`,
          [orderId]
        );

        const { table_number, location_id } = orderQuery.rows[0];

        // Create the bill
        const billQuery = await pool.query(
          `INSERT INTO public.Bill (order_id, payment_method, tips, total_amount)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [orderId, paymentMethod, tips, totalAmount]
        );

        const billId = billQuery.rows[0].id;

        // Process each product for this order
        for (const { orderProductId, quantity, price } of products) {
          // Get current quantity
          const productOrderQuery = await pool.query(
            `SELECT quantity FROM public.ProductOrder WHERE id = $1`,
            [orderProductId]
          );

          const currentQuantity = productOrderQuery.rows[0].quantity;

          if (quantity === currentQuantity) {
            // Bill the entire quantity - just update status
            await pool.query(
              `UPDATE public.ProductOrder SET status = 'billed' WHERE id = $1`,
              [orderProductId]
            );

            // Add item to the bill
            await pool.query(
              `INSERT INTO public.BillItem (bill_id, product_order_id, quantity, price)
               VALUES ($1, $2, $3, $4)`,
              [billId, orderProductId, quantity, price]
            );

            processedProducts.push({
              orderProductId,
              action: "billed",
              quantity,
              billId,
            });
          } else {
            // Partial billing - split the product order
            const remainingQuantity = currentQuantity - quantity;

            // Create new order product for the billed quantity
            const newOrderProductQuery = await pool.query(
              `INSERT INTO public.ProductOrder (order_id, product_id, quantity, status) 
               VALUES ($1, $2, $3, 'billed') RETURNING id`,
              [orderId, products[0].productId, quantity]
            );

            const newOrderProductId = newOrderProductQuery.rows[0].id;

            // Add item to the bill
            await pool.query(
              `INSERT INTO public.BillItem (bill_id, product_order_id, quantity, price)
               VALUES ($1, $2, $3, $4)`,
              [billId, newOrderProductId, quantity, price]
            );

            // Update original order product with remaining quantity
            await pool.query(
              `UPDATE public.ProductOrder SET quantity = $1 WHERE id = $2`,
              [remainingQuantity, orderProductId]
            );

            processedProducts.push({
              originalOrderProductId: orderProductId,
              newOrderProductId,
              action: "split-and-billed",
              billedQuantity: quantity,
              remainingQuantity,
              billId,
            });
          }
        }

        // Notify waiters through socket
        const io = getIo();
        io.to(`waiter-${location_id}`).emit("bill-created", {
          table: table_number,
          billId: billId,
        });
      }

      // Commit the transaction
      await pool.query("COMMIT");

      res.status(200).json({
        message: "Bill created successfully",
        processedProducts: processedProducts,
        totalAmount,
      });
    } catch (err) {
      // Rollback in case of error
      await pool.query("ROLLBACK");
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.post(
  "/respond-to-call/:tableNumber",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);
      const tableNumber = parseInt(req.params.tableNumber, 10);

      // Find the active order with waiter_called_at set for this table
      const orderQuery = await pool.query(
        `SELECT id, waiter_called_at FROM public.Order 
         WHERE table_number = $1 AND location_id = $2 AND active = TRUE AND waiter_called_at IS NOT NULL
         ORDER BY waiter_called_at DESC
         LIMIT 1;`,
        [tableNumber, locationId]
      );

      if (orderQuery.rows.length === 0) {
        res.status(400).json({ error: "Waiter was not called for this table" });
        return;
      }

      const orderId = orderQuery.rows[0].id;

      // Update the order to clear the waiter_called_at timestamp
      await pool.query(
        "UPDATE public.Order SET waiter_called_at = NULL WHERE id = $1",
        [orderId]
      );

      // Check if this is an empty order (no products)
      const productCountQuery = await pool.query(
        `SELECT COUNT(*) as count FROM public.ProductOrder WHERE order_id = $1`,
        [orderId]
      );

      const productCount = parseInt(productCountQuery.rows[0].count);

      // If this is an empty order with no products, we can deactivate it
      if (productCount === 0) {
        await pool.query(
          `UPDATE public.Order SET active = FALSE WHERE id = $1`,
          [orderId]
        );
      }

      res.status(200).json({
        message: "Responded to waiter call successfully",
        tableNumber: tableNumber,
        emptyOrder: productCount === 0,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/bills/:tableNumber",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);
      const tableNumber = parseInt(req.params.tableNumber, 10);

      // Get all unpaid bills for this table and location
      const billsQuery = await pool.query(
        `SELECT 
          b.id, 
          b.order_id, 
          b.payment_method, 
          b.tips, 
          b.total_amount, 
          b.created_at
        FROM 
          public.Bill b
        JOIN 
          public.Order o ON b.order_id = o.id
        WHERE 
          o.location_id = $1 AND o.table_number = $2 AND b.paid_at IS NULL
        ORDER BY 
          b.created_at DESC`,
        [locationId, tableNumber]
      );

      // For each bill, get the items
      const bills: BillResponseDto[] = [];
      for (const bill of billsQuery.rows) {
        const billItemsQuery = await pool.query(
          `SELECT 
            bi.id,
            bi.quantity,
            bi.price,
            p.id AS "productId",
            p.name
          FROM 
            public.BillItem bi
          JOIN 
            public.ProductOrder po ON bi.product_order_id = po.id
          JOIN 
            public.Product p ON po.product_id = p.id
          WHERE 
            bi.bill_id = $1`,
          [bill.id]
        );

        const billItems: BillItemDto[] = billItemsQuery.rows.map((item) => ({
          id: item.id,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        }));

        bills.push({
          id: bill.id,
          tableNumber: tableNumber,
          paymentMethod: bill.payment_method,
          tips: bill.tips,
          totalAmount: bill.total_amount,
          createdAt: bill.created_at,
          items: billItems,
        });
      }

      res.status(200).json(bills);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        console.error("Error fetching bills:", error);
      }
    }
  }
);

// Confirm payment for a bill
router.post(
  "/pay-bill/:billId",
  authenticateToken,
  checkWaiterRole,
  async (req: Request, res: Response) => {
    try {
      const billId = req.params.billId;

      // Start a transaction
      await pool.query("BEGIN");

      // Check if the bill exists
      const billQuery = await pool.query(
        `SELECT id, order_id, paid_at FROM public.Bill WHERE id = $1`,
        [billId]
      );

      if (billQuery.rows.length === 0) {
        await pool.query("ROLLBACK");
        res.status(404).json({ error: "Bill not found" });
        return;
      }

      // Check if the bill is already paid
      if (billQuery.rows[0].paid_at) {
        await pool.query("ROLLBACK");
        res.status(400).json({ error: "Bill is already paid" });
        return;
      }

      const orderId = billQuery.rows[0].order_id;

      // Update the bill to mark it as paid
      await pool.query(`UPDATE public.Bill SET paid_at = NOW() WHERE id = $1`, [
        billId,
      ]);

      // Get all product orders associated with this bill
      const billItemsQuery = await pool.query(
        `SELECT bi.product_order_id
         FROM public.BillItem bi
         WHERE bi.bill_id = $1`,
        [billId]
      );

      // Process each product order
      for (const item of billItemsQuery.rows) {
        const { product_order_id } = item;

        // Get the current product order status
        const productOrderQuery = await pool.query(
          `SELECT status FROM public.ProductOrder WHERE id = $1`,
          [product_order_id]
        );

        if (productOrderQuery.rows.length === 0) {
          await pool.query("ROLLBACK");
          res.status(500).json({
            error: "Product order not found",
            productOrderId: product_order_id,
          });
          return;
        }

        const { status: currentStatus } = productOrderQuery.rows[0];

        // Check if the product is in 'billed' status
        if (currentStatus !== "billed") {
          await pool.query("ROLLBACK");
          res.status(400).json({
            error: `Cannot confirm payment for product. Current status is "${currentStatus}", expected "billed"`,
            productOrderId: product_order_id,
          });
          return;
        }

        // Since product orders are already split during bill creation,
        // we can simply update the status to 'payed' without checking quantities
        await pool.query(
          `UPDATE public.ProductOrder SET status = 'payed' WHERE id = $1`,
          [product_order_id]
        );
      }

      // Check if all products in the order are now paid
      const unpaidProductsQuery = await pool.query(
        `SELECT COUNT(*) as count FROM public.ProductOrder 
         WHERE order_id = $1 AND status != 'payed'`,
        [orderId]
      );

      const unpaidCount = parseInt(unpaidProductsQuery.rows[0].count);

      // If all products are paid, set the order to inactive
      if (unpaidCount === 0) {
        await pool.query(
          `UPDATE public.Order SET active = FALSE WHERE id = $1`,
          [orderId]
        );
      }

      // Commit the transaction
      await pool.query("COMMIT");

      // Get the table number for this order
      const orderQuery = await pool.query(
        `SELECT table_number, location_id FROM public.Order WHERE id = $1`,
        [orderId]
      );

      const { table_number, location_id } = orderQuery.rows[0];

      // Notify waiters through socket
      const io = getIo();
      io.to(`waiter-${location_id}`).emit("bill-paid", {
        table: table_number,
        billId: billId,
      });

      res.status(200).json({
        message: "Bill payment confirmed successfully",
        billId: billId,
        orderStatus: unpaidCount === 0 ? "completed" : "partial",
      });
    } catch (error) {
      // Rollback in case of error
      await pool.query("ROLLBACK");

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        console.error("Error confirming bill payment:", error);
      }
    }
  }
);

export default router;
