import express, { Request, Response } from "express";
import {
  getLocationIdFromSlug,
  checkLocationActive,
} from "../middleware/customerMiddleware";
import {
  CreateOrderDto,
  CartItemDto,
  ProductStatus,
  ProductQuantityDto,
  ProductModel,
  CategoryWithProductsDto,
  CreateBillDto,
} from "shared";
import { getIo } from "../sockets";
import pool from "../db";

const router = express.Router();

router.get(
  "/:locationSlug/product",
  checkLocationActive,
  async (req: Request, res: Response) => {
    try {
      const locationSlug = req.params.locationSlug;
      const locationId = await getLocationIdFromSlug(pool, locationSlug);

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

      const categoriesWithProducts: CategoryWithProductsDto[] =
        categoriesWithProductsQuery.rows;

      res.status(200).json(categoriesWithProducts);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        console.error("Error fetching products:", error);
      }
    }
  }
);

router.post(
  "/order/:locationSlug/:table",
  checkLocationActive,
  async (req: Request, res: Response) => {
    try {
      const locationSlug = req.params.locationSlug;
      const locationId = await getLocationIdFromSlug(pool, locationSlug);
      const table = parseInt(req.params.table, 10);
      const ordersDetails: CreateOrderDto = req.body;

      const productIds = ordersDetails.products.map(
        (p: ProductQuantityDto) => p.id
      );

      const productsQuery = await pool.query(
        `SELECT id, initial_status FROM public.Product WHERE id = ANY($1)`,
        [productIds]
      );
      const products: ProductModel[] = productsQuery.rows;

      const foundProductIds = products.map((p) => p.id);

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
      const productStatusMap: { [id: string]: ProductStatus } = {};

      products.forEach(async (p: ProductModel) => {
        productStatusMap[p.id] = p.initial_status;
      });

      const getOrderQuery = await pool.query(
        ` SELECT id 
        FROM public.Order 
        WHERE table_number = $1 AND location_id = $2 AND active = TRUE
        LIMIT 1;`,
        [table, locationId]
      );

      let orderId: string = getOrderQuery.rows[0]?.id;

      if (!orderId) {
        const orderQuery = await pool.query(
          "INSERT INTO public.order (table_number, location_id) VALUES ($1, $2) RETURNING id",
          [table, locationId]
        );
        orderId = orderQuery.rows[0].id;
      }

      for (const orderDetails of ordersDetails.products) {
        await pool.query(
          "INSERT INTO public.ProductOrder (order_id, product_id, quantity, status, created_at) VALUES ($1, $2, $3, $4, $5)",
          [
            orderId,
            orderDetails.id,
            orderDetails.quantity,
            productStatusMap[orderDetails.id],
            ordersDetails.orderTime,
          ]
        );
      }

      const io = getIo();

      const statusSet = new Set<ProductStatus>();
      ordersDetails.products.forEach((orderDetails) => {
        const status = productStatusMap[orderDetails.id];
        statusSet.add(status);
      });

      statusSet.forEach((status) => {
        if (status !== "ready") {
          io.to(`${status}-${locationId}`).emit("order-ping", {
            table: table,
          });
          console.log(`${status}-${locationId}`);
        }
      });

      io.to(`waiter-${locationId}`).emit("order-ping", {
        table: table,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });

        return;
      }
    }
    res.status(200).json({ message: "Order created." });
  }
);

router.put(
  "/order/:locationSlug/:table",
  checkLocationActive,
  async (req: Request, res: Response) => {
    try {
      const locationSlug = req.params.locationSlug;
      const locationId = await getLocationIdFromSlug(pool, locationSlug);

      const table = parseInt(req.params.table, 10);

      const ordersDetails: CreateOrderDto = req.body;

      const productIds = ordersDetails.products.map(
        (p: ProductQuantityDto) => p.id
      );

      const productsQuery = await pool.query(
        `SELECT id, initial_status FROM public.Product WHERE id = ANY($1)`,
        [productIds]
      );
      const products: ProductModel[] = productsQuery.rows;

      const foundProductIds = products.map((p) => p.id);

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

      const productStatusMap: { [id: string]: ProductStatus } = {};

      products.forEach(async (p: ProductModel) => {
        productStatusMap[p.id] = p.initial_status;
      });

      const orderQuery = await pool.query(
        ` SELECT id 
        FROM public.Order 
        WHERE table_number = $1 AND location_id = $2 AND active = TRUE
        LIMIT 1;`,
        [table, locationId]
      );

      const orderId: string = orderQuery.rows[0].id;

      for (const orderDetails of ordersDetails.products) {
        await pool.query(
          "INSERT INTO public.ProductOrder (order_id, product_id, quantity, status, created_at) VALUES ($1, $2, $3, $4, $5)",
          [
            orderId,
            orderDetails.id,
            orderDetails.quantity,
            productStatusMap[orderDetails.id],
            ordersDetails.orderTime,
          ]
        );
      }

      const io = getIo();

      // Send pings based on product statuses
      const statusSet = new Set<ProductStatus>();
      ordersDetails.products.forEach((orderDetails) => {
        const status = productStatusMap[orderDetails.id];
        statusSet.add(status);
      });

      statusSet.forEach((status) => {
        if (status !== "ready") {
          io.to(`${status}-${locationId}`).emit("order-ping", {
            table: table,
          });
        }
      });

      io.to(`waiter-${locationId}`).emit("order-ping", {
        table: table,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
    }
    res.status(200).json({ message: "Order created." });
  }
);

router.get(
  "/order/:locationSlug/:table",
  checkLocationActive,
  async (req: Request, res: Response) => {
    try {
      const locationSlug = req.params.locationSlug;
      const locationId = await getLocationIdFromSlug(pool, locationSlug);
      const table = parseInt(req.params.table, 10);

      const orderQuery = await pool.query<CartItemDto>(
        `
      SELECT 
        p.id AS "productId",
        op.quantity,
        p.name,
        p.price
      FROM 
        public.Order o
      JOIN 
        public.ProductOrder op ON o.id = op.order_id
      JOIN 
        public.Product p ON op.product_id = p.id
      WHERE 
        o.table_number = $1 AND o.location_id = $2 AND o.active = TRUE;
        `,
        [table, locationId]
      );

      if (orderQuery.rows.length === 0) {
        res.status(200).json([]);
        return;
      }

      const orderDetails: CartItemDto[] = orderQuery.rows;

      res.status(200).json(orderDetails);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

router.get(
  "/unpaid-order/:locationSlug/:table",
  checkLocationActive,
  async (req: Request, res: Response) => {
    try {
      const locationSlug = req.params.locationSlug;
      const locationId = await getLocationIdFromSlug(pool, locationSlug);
      const table = parseInt(req.params.table, 10);

      const orderQuery = await pool.query<CartItemDto>(
        `
      SELECT 
        p.id AS "productId",
        op.quantity,
        p.name,
        p.price
      FROM 
        public.Order o
      JOIN 
        public.ProductOrder op ON o.id = op.order_id
      JOIN 
        public.Product p ON op.product_id = p.id
      WHERE 
        o.table_number = $1 AND o.location_id = $2 AND o.active = TRUE AND op.status = 'delivered';
        `,
        [table, locationId]
      );

      if (orderQuery.rows.length === 0) {
        res.status(200).json([]);
        return;
      }

      // Merge products with the same ID and add their quantities
      const productMap: { [productId: string]: CartItemDto } = {};

      orderQuery.rows.forEach((item) => {
        if (productMap[item.productId]) {
          // If product already exists in the map, add the quantity
          productMap[item.productId].quantity += item.quantity;
        } else {
          // Otherwise, add the product to the map
          productMap[item.productId] = { ...item };
        }
      });

      // Convert the map back to an array
      const mergedOrderDetails: CartItemDto[] = Object.values(productMap);

      res.status(200).json(mergedOrderDetails);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

router.post(
  "/call-waiter/:locationSlug/:table",
  checkLocationActive,
  async (req: Request, res: Response) => {
    try {
      const locationSlug = req.params.locationSlug;
      const locationId = await getLocationIdFromSlug(pool, locationSlug);
      const table = parseInt(req.params.table, 10);

      // Start a transaction to ensure data consistency
      await pool.query("BEGIN");

      // Find any order for this table (active or inactive)
      const orderQuery = await pool.query(
        `SELECT id, active FROM public.Order 
         WHERE table_number = $1 AND location_id = $2
         ORDER BY active DESC, order_time DESC
         LIMIT 1;`,
        [table, locationId]
      );

      let orderId: string;

      if (orderQuery.rows.length === 0) {
        // If no order exists at all, create a new active one
        const newOrderQuery = await pool.query(
          "INSERT INTO public.Order (table_number, location_id, waiter_called_at, active) VALUES ($1, $2, NOW(), TRUE) RETURNING id",
          [table, locationId]
        );
        orderId = newOrderQuery.rows[0].id;
      } else if (!orderQuery.rows[0].active) {
        // If only inactive orders exist, create a new active one
        const newOrderQuery = await pool.query(
          "INSERT INTO public.Order (table_number, location_id, waiter_called_at, active) VALUES ($1, $2, NOW(), TRUE) RETURNING id",
          [table, locationId]
        );
        orderId = newOrderQuery.rows[0].id;
      } else {
        // Update existing active order with waiter_called_at timestamp
        orderId = orderQuery.rows[0].id;
        await pool.query(
          "UPDATE public.Order SET waiter_called_at = NOW() WHERE id = $1",
          [orderId]
        );
      }

      // Commit the transaction
      await pool.query("COMMIT");

      // Notify waiters through socket
      const io = getIo();
      io.to(`waiter-${locationId}`).emit("order-ping", {
        table: table,
      });

      res.status(200).json({
        message: "Waiter called successfully",
        orderId: orderId,
      });
    } catch (error) {
      // Rollback in case of error
      await pool.query("ROLLBACK");

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        console.error("Error calling waiter:", error);
      }
    }
  }
);

router.get(
  "/waiter-called/:locationSlug/:table",
  checkLocationActive,
  async (req: Request, res: Response) => {
    try {
      const locationSlug = req.params.locationSlug;
      const locationId = await getLocationIdFromSlug(pool, locationSlug);
      const table = parseInt(req.params.table, 10);

      // Check if there's an active order with waiter_called_at set
      const orderQuery = await pool.query(
        `SELECT waiter_called_at FROM public.Order 
         WHERE table_number = $1 AND location_id = $2 AND active = TRUE
         ORDER BY waiter_called_at DESC NULLS LAST
         LIMIT 1;`,
        [table, locationId]
      );

      // If no order exists or waiter_called_at is null, return false
      if (
        orderQuery.rows.length === 0 ||
        !orderQuery.rows[0].waiter_called_at
      ) {
        res.status(200).json(false);
        return;
      }

      // Check if waiter was called within the last 10 seconds
      const waiterCalledAt = new Date(orderQuery.rows[0].waiter_called_at);

      res.status(200).json(!!waiterCalledAt);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        console.error("Error checking waiter called status:", error);
      }
    }
  }
);

router.post(
  "/bill/:locationSlug/:table",
  checkLocationActive,
  async (req: Request, res: Response) => {
    try {
      const locationSlug = req.params.locationSlug;
      const locationId = await getLocationIdFromSlug(pool, locationSlug);
      const table = parseInt(req.params.table, 10);
      const billDetails: CreateBillDto = req.body;

      // Start a transaction to ensure data consistency
      await pool.query("BEGIN");

      // Get the active order for this table
      const orderQuery = await pool.query(
        `SELECT id FROM public.Order 
         WHERE table_number = $1 AND location_id = $2 AND active = TRUE
         LIMIT 1;`,
        [table, locationId]
      );

      if (orderQuery.rows.length === 0) {
        await pool.query("ROLLBACK");
        res.status(404).json({ error: "No active order found for this table" });
        return;
      }

      const orderId = orderQuery.rows[0].id;

      // Calculate total amount (sum of all items plus tips)
      let totalAmount = billDetails.tips;
      for (const item of billDetails.items) {
        totalAmount += item.price * item.quantity;
      }

      // Create the bill
      const billQuery = await pool.query(
        `INSERT INTO public.Bill (order_id, payment_method, tips, total_amount)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [orderId, billDetails.paymentMethod, billDetails.tips, totalAmount]
      );

      const billId = billQuery.rows[0].id;

      // Get product order IDs for the items in the bill
      for (const item of billDetails.items) {
        // Find matching product orders
        const productOrderQuery = await pool.query(
          `SELECT po.id, po.quantity
           FROM public.ProductOrder po
           JOIN public.Product p ON po.product_id = p.id
           WHERE po.order_id = $1 AND p.id = $2 AND po.status = 'delivered'
           ORDER BY po.created_at`,
          [orderId, item.productId]
        );

        if (productOrderQuery.rows.length === 0) {
          await pool.query("ROLLBACK");
          res.status(400).json({
            error:
              "One or more products in the bill are not available or not delivered",
            productId: item.productId,
          });
          return;
        }

        // We need to handle the case where the requested quantity might span multiple product orders
        let remainingQuantity = item.quantity;
        let rowIndex = 0;

        while (
          remainingQuantity > 0 &&
          rowIndex < productOrderQuery.rows.length
        ) {
          const productOrder = productOrderQuery.rows[rowIndex];
          const quantityToUse = Math.min(
            remainingQuantity,
            productOrder.quantity
          );

          // Add item to the bill
          await pool.query(
            `INSERT INTO public.BillItem (bill_id, product_order_id, quantity, price)
             VALUES ($1, $2, $3, $4)`,
            [billId, productOrder.id, quantityToUse, item.price]
          );

          // If the quantity being billed is less than the quantity in the order, split the product order
          if (quantityToUse < productOrder.quantity) {
            const remainingOrderQuantity =
              productOrder.quantity - quantityToUse;

            // Get the current product details
            const productDetailsQuery = await pool.query(
              `SELECT product_id, created_at, status FROM public.ProductOrder WHERE id = $1`,
              [productOrder.id]
            );

            const { product_id, created_at, status } =
              productDetailsQuery.rows[0];

            // Create a new product order for the billed portion
            await pool.query(
              `UPDATE public.ProductOrder SET quantity = $1, status = 'billed' WHERE id = $2`,
              [quantityToUse, productOrder.id]
            );

            // Create a new product order for the remaining quantity with the original status
            await pool.query(
              `INSERT INTO public.ProductOrder (order_id, product_id, quantity, status, created_at) 
               VALUES ($1, $2, $3, $4, $5)`,
              [orderId, product_id, remainingOrderQuantity, status, created_at]
            );
          } else {
            // If the entire quantity is being billed, just update the status
            await pool.query(
              `UPDATE public.ProductOrder SET status = 'billed' WHERE id = $1`,
              [productOrder.id]
            );
          }

          remainingQuantity -= quantityToUse;
          rowIndex++;
        }

        if (remainingQuantity > 0) {
          await pool.query("ROLLBACK");
          res.status(400).json({
            error: "Insufficient quantity available for product",
            productId: item.productId,
            requestedQuantity: item.quantity,
            availableQuantity: item.quantity - remainingQuantity,
          });
          return;
        }
      }

      // Commit the transaction
      await pool.query("COMMIT");

      // Notify waiters through socket
      const io = getIo();
      io.to(`waiter-${locationId}`).emit("bill-request", {
        table: table,
        billId: billId,
      });

      res.status(200).json({
        message: "Bill created successfully",
        billId: billId,
      });
    } catch (error) {
      // Rollback in case of error
      await pool.query("ROLLBACK");

      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        console.error("Error creating bill:", error);
      }
    }
  }
);

export default router;
