import express, { Request, Response } from "express";
import { getLocationIdFromSlug } from "../middleware/customerMiddleware";
import {
  CreateOrderDto,
  CartItemDto,
  ProductStatus,
  ProductQuantityDto,
  ProductModel,
  CategoryWithProductsDto,
} from "shared";
import { getIo } from "../sockets";
import pool from "../db";

const router = express.Router();

router.get("/:locationSlug/product", async (req: Request, res: Response) => {
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
});

router.post(
  "/order/:locationSlug/:table",
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
        WHERE table_number = $1 AND location_id = $2
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
        WHERE table_number = $1 AND location_id = $2
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
        o.table_number = $1 AND o.location_id = $2;
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

export default router;
