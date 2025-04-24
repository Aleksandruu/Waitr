import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/authMiddleware";
import { checkManagerRole } from "../middleware/roleMiddleware";
import {
  getLocationFromRequest,
  checkCategoryExistsById,
  checkCategoryExistsByName,
} from "../middleware/managerMiddleware";
import { validateFields } from "../middleware/commonMiddleware";
import { Pool } from "pg";
import { Category } from "shared/models/category.response.model";
import { ProductRequest } from "shared/models/product.request.model";
import { ProductsResponse } from "shared/models/products.response.model";

const router = express.Router();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

//categories

router.post(
  "/category",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    const { name } = req.body;

    try {
      validateFields({ name }, req.body);

      const locationId = getLocationFromRequest(req);

      if (await checkCategoryExistsByName(pool, name, locationId)) {
        res.status(400).json({ error: "Category already exists." });
        res.send();
        return;
      }

      await pool.query(
        "INSERT INTO public.Category (name, location_id) VALUES ($1, $2)",
        [name, locationId]
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
      return;
    }

    res.status(201).json({ message: "Category created." });
    res.send();
  }
);

router.delete(
  "/category/:id",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const result = await pool.query(
        "SELECT COUNT(*) FROM public.Product WHERE category_id = $1",
        [id]
      );

      const productCount = parseInt(result.rows[0].count, 10);

      if (productCount > 0) {
        res.status(400).json({
          error:
            "Cannot delete category. There are products contained in this category.",
        });
        res.send();
        return;
      }

      await pool.query("DELETE FROM public.Category WHERE id = $1", [id]);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
      return;
    }

    res.status(200).json({ message: "Category deleted." });
    res.send();
  }
);

router.get(
  "/category",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);

      const categoriesQuerry = await pool.query(
        "SELECT * FROM public.Category WHERE location_id = $1",
        [locationId]
      );
      const categories: Category[] = categoriesQuerry.rows;
      res.status(200).json(categories);
      res.send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
    }
  }
);

//products

router.post(
  "/product",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    const productRequest: ProductRequest = req.body;

    try {
      validateFields({ ...productRequest }, req.body);

      if (!(await checkCategoryExistsById(pool, productRequest.category_id))) {
        res.status(400).json({ error: "Category does not exist." });
        res.send();
        return;
      }

      await pool.query(
        "INSERT INTO public.Product (name, ingredients, nutrients, allergens, price, category_id, ready) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          productRequest.name,
          productRequest.ingredients,
          productRequest.nutrients,
          productRequest.allergens,
          productRequest.price,
          productRequest.category_id,
          productRequest.ready,
        ]
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
      return;
    }

    res.status(201).json({ message: "Product created." });
    res.send();
  }
);

router.put(
  "/product/:id",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const {
      name,
      ingredients,
      nutrients,
      allergens,
      price,
      category_id,
      ready,
    }: ProductRequest = req.body;

    try {
      validateFields(
        { name, ingredients, nutrients, allergens, price, category_id, ready },
        req.body
      );

      if (!(await checkCategoryExistsById(pool, category_id))) {
        res.status(400).json({ error: "Category does not exist." });
        res.send();
        return;
      }

      await pool.query(
        "UPDATE public.Product SET name = $1, ingredients = $2, nutrients = $3, allergens = $4, price = $5, category_id = $6, ready = $7 WHERE id = $8",
        [name, ingredients, nutrients, allergens, price, category_id, ready, id]
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
      return;
    }

    res.status(200).json({ message: "Product updated." });
    res.send();
  }
);

router.delete(
  "/product/:id",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      await pool.query("DELETE FROM public.Product WHERE id = $1", [id]);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
      return;
    }

    res.status(200).json({ message: "Product deleted." });
    res.send();
  }
);

router.get(
  "/product",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);

      const categoriesWithProductsQuerry = await pool.query(
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
      const categoriesWithProducts: ProductsResponse[] =
        categoriesWithProductsQuerry.rows;
      res.status(200).json(categoriesWithProducts);
      res.send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
    }
  }
);

//employee

router.post(
  "/employee",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    const { username, role, password } = req.body;

    try {
      const locationId = getLocationFromRequest(req);

      const hashedPassword = await bcrypt.hash(password, 10);

      await pool.query(
        "INSERT INTO public.User (name, role, password, location_id) VALUES ($1, $2, $3, $4)",
        [username, role, hashedPassword, locationId]
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
      return;
    }

    res.status(201).json({ message: "Employee created." });
    res.send();
  }
);

router.get(
  "/employee",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);

      const employees = await pool.query(
        "SELECT id, name, role FROM public.User WHERE location_id = $1 AND role != 'manager'",
        [locationId]
      );

      res.status(200).json(employees.rows);
      res.send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
    }
  }
);

//location
router.get(
  "/location",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);

      const locations = await pool.query(
        "SELECT * FROM public.Location WHERE id = $1",
        [locationId]
      );

      res.status(200).json(locations.rows[0]);
      res.send();
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        res.send();
      }
    }
  }
);

export default router;
