import express, { Request, Response } from "express";
import { Pool } from "pg";
// import { getIo } from "../middleware/socket";
import { Product } from "shared/models/product.model";
import { getLocationIdFromSlug } from "../middleware/customerMiddleware";

const router = express.Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

// let io;
// setTimeout(() => {
//   io = getIo();
// });

router.get("/:locationSlug/product", async (req: Request, res: Response) => {
  try {
    const locationSlug = req.params.locationSlug;
    const locationId = await getLocationIdFromSlug(pool, locationSlug);
    const categories = await pool.query(
      `
        SELECT 
            c.id AS category_id,
            c.name AS category_name,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'id', p.id,
                        'name', p.name,
                        'ingredients', p.ingredients,
                        'nutrients', p.nutrients,
                        'allergens', p.allergens,
                        'price', p.price
                    )
                ) FILTER (WHERE p.id IS NOT NULL), 
                '[]'
            ) AS products
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
    res.status(200).json(categories.rows);
    res.send();
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      res.send();
    }
  }
});

router.post(
  "/order/:locationSlug/:table",
  async (req: Request, res: Response) => {
    try {
      const locationSlug = req.params.locationSlug;
      const locationId = await getLocationIdFromSlug(pool, locationSlug);
      const table = req.params.table;
      const ordersDetails = req.body.orderDetails;

      const order = await pool.query(
        "INSERT INTO public.order (table_number, location_id, preferences) VALUES ($1, $2, $3) RETURNING id",
        [table, locationId, ordersDetails.preferences]
      );

      const productIds = ordersDetails.map((p: Product) => p.id);

      const productsQueryRes = await pool.query(
        `SELECT id, ready FROM public.Product WHERE id = ANY($1)`,
        [productIds]
      );
      const products: Product[] = productsQueryRes.rows;

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
          res.send();
          return;
        }
      }

      const productStatusMap: { [id: string]: string } = {};

      products.forEach((p: Product) => {
        productStatusMap[p.id] = p.ready;
      });

      for (const orderDetails of ordersDetails) {
        await pool.query(
          "INSERT INTO public.ProductOrder (order_id, product_id, quantity, status) VALUES ($1, $2, $3, $4)",
          [
            order.rows[0].id,
            orderDetails.productId,
            orderDetails.quantity,
            productStatusMap[orderDetails.productId],
          ]
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
        return;
      }
    }
    res.status(200).json({ message: "Order created." });
    res.send();
  }
);

export default router;
