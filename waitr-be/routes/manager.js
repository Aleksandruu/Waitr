const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { authenticateToken } = require("../middleware/authMiddleware");
const { checkManagerRole } = require("../middleware/roleMiddleware");
const {
  getLocationFromRequest,
  checkCategoryExistsById,
  checkCategoryExistsByName,
} = require("../middleware/managerMiddleware");
const { validateFields } = require("../middleware/commonMiddleware");

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

//categories

router.post(
  "/category",
  authenticateToken,
  checkManagerRole,
  async (req, res) => {
    const { name } = req.body;

    try {
      validateFields({ name }, req.body);

      const locationId = getLocationFromRequest(req);

      if (await checkCategoryExistsByName(pool, name, locationId)) {
        return res.status(400).json({ error: "Category already exists." });
      }

      await pool.query(
        "INSERT INTO public.Category (name, location_id) VALUES ($1, $2)",
        [name, locationId]
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Category created." });
  }
);

router.delete(
  "/category/:id",
  authenticateToken,
  checkManagerRole,
  async (req, res) => {
    const id = req.params.id;

    try {
      const result = await pool.query(
        "SELECT COUNT(*) FROM public.Product WHERE category_id = $1",
        [id]
      );

      const productCount = parseInt(result.rows[0].count, 10);

      if (productCount > 0) {
        return res.status(400).json({
          error:
            "Cannot delete category. There are products contained in this category.",
        });
      }

      await pool.query("DELETE FROM public.Category WHERE id = $1", [id]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Category deleted." });
  }
);

router.get(
  "/category",
  authenticateToken,
  checkManagerRole,
  async (req, res) => {
    try {
      const locationId = getLocationFromRequest(req);

      const categories = await pool.query(
        "SELECT * FROM public.Category WHERE location_id = $1",
        [locationId]
      );
      return res.status(200).json(categories.rows);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
);

//products

router.post(
  "/product",
  authenticateToken,
  checkManagerRole,
  async (req, res) => {
    const {
      name,
      ingredients,
      nutrients,
      allergens,
      price,
      category_id,
      ready,
    } = req.body;

    try {
      validateFields(
        { name, ingredients, nutrients, allergens, price, category_id, ready },
        req.body
      );

      if (!(await checkCategoryExistsById(pool, category_id))) {
        return res.status(400).json({ error: "Category does not exist." });
      }

      await pool.query(
        "INSERT INTO public.Product (name, ingredients, nutrients, allergens, price, category_id, ready) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [name, ingredients, nutrients, allergens, price, category_id, ready]
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Product created." });
  }
);

router.put(
  "/product/:id",
  authenticateToken,
  checkManagerRole,
  async (req, res) => {
    const id = req.params.id;
    const {
      name,
      ingredients,
      nutrients,
      allergens,
      price,
      category_id,
      ready,
    } = req.body;

    try {
      validateFields(
        { name, ingredients, nutrients, allergens, price, category_id, ready },
        req.body
      );

      if (!(await checkCategoryExistsById(pool, category_id))) {
        return res.status(400).json({ error: "Category does not exist." });
      }

      await pool.query(
        "UPDATE public.Product SET name = $1, ingredients = $2, nutrients = $3, allergens = $4, price = $5, category_id = $6, ready = $7 WHERE id = $8",
        [name, ingredients, nutrients, allergens, price, category_id, ready, id]
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Product updated." });
  }
);

router.delete(
  "/product/:id",
  authenticateToken,
  checkManagerRole,
  async (req, res) => {
    const id = req.params.id;

    try {
      await pool.query("DELETE FROM public.Product WHERE id = $1", [id]);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Product deleted." });
  }
);

router.get("/product", authenticateToken, async (req, res) => {
  try {
    const locationId = getLocationFromRequest(req);

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

//employee

router.post(
  "/employee",
  authenticateToken,
  checkManagerRole,
  async (req, res) => {
    const { username, role, password } = req.body;

    try {
      const locationId = getLocationFromRequest(req);

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO public.User (name, role, password, location_id) VALUES ($1, $2, $3, $4)",
        [username, role, hashedPassword, locationId]
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    res.sendStatus(201);
  }
);

module.exports = router;
