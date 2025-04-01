const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const { getIo } = require("../middleware/socket");
const { OrderStatus } = require("../models/orderStatus.enum");
const { getLocationIdFromSlug } = require("../middleware/customerMiddleware");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

// let io;
// setTimeout(() => {
//   io = getIo();
// });

router.get("/:locationSlug/product", async (req, res) => {
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
    return res.status(200).json(categories.rows);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post("/order/:locationSlug/:table", async (req, res) => {
  try {
    const locationSlug = req.params.locationSlug;
    const locationId = await getLocationIdFromSlug(pool, locationSlug);
    const table = req.params.table;
    const ordersDetails = req.body.orderDetails;

    const order = await pool.query(
      "INSERT INTO public.order (table_number, location_id, preferences) VALUES ($1, $2, $3) RETURNING id",
      [table, locationId, ordersDetails.preferences]
    );

    const productIds = ordersDetails.map((p) => p.productId);

    const products = await pool.query(
      `SELECT id, ready FROM public.Product WHERE id = ANY($1)`,
      [productIds]
    );

    const foundProductIds = products.rows.map((p) => p.id);
    if (foundProductIds.length < productIds.length) {
      const invalidProductIds = productIds.filter(
        (id) => !foundProductIds.includes(id)
      );

      if (invalidProductIds.length > 0) {
        return res.status(400).json({
          error: "Invalid product IDs",
          invalidProductIds,
        });
      }
    }

    const productStatusMap = [];
    products.rows.forEach((p) => {
      productStatusMap[p.id] = p.ready
        ? OrderStatus.ready
        : OrderStatus.ordered;
    });

    for (orderDetails of ordersDetails) {
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
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ message: "Order created." });
});

module.exports = router;
