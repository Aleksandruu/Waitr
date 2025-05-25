import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { authenticateToken } from "../middleware/authMiddleware";
import { checkManagerRole } from "../middleware/roleMiddleware";
import { addPhotoToCloud } from "../middleware/addPhotoToCloud";
import {
  getLocationFromRequest,
  checkCategoryExistsById,
  checkCategoryExistsByName,
} from "../middleware/managerMiddleware";
import { validateFields } from "../middleware/commonMiddleware";
import {
  CategoryModel,
  CreateProductDto,
  LocationSettingsDto,
  ManagerProductResponseDto,
} from "shared";
import multer from "multer";
import pool from "../db";

const upload = multer();

const router = express.Router();

interface UploadLocationSettingsRequest extends Request {
  body: {
    slug: string;
    name: string;
    logoMime: string;
    color: string;
  };
  file?: Express.Multer.File;
}

interface Body {
  [key: string]: string | number | boolean | File;
}

interface UploadProductRequest extends Request {
  body: CreateProductDto;
  file?: Express.Multer.File;
}

router.patch(
  "/location/settings",
  authenticateToken,
  checkManagerRole,
  upload.single("logo"),
  async (req: UploadLocationSettingsRequest, res: Response) => {
    const { slug, name, color }: LocationSettingsDto = req.body;
    const file = req.file;

    try {
      pool.query(
        "UPDATE public.Location SET slug = $1, name = $2, logo = $3, logo_mime = $4, color = $5 WHERE id = $6",
        [
          slug,
          name,
          file?.buffer,
          file?.mimetype,
          color,
          getLocationFromRequest(req),
        ]
      );
      res.status(200).json({ message: "Location updated." });
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
    }
  }
);

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
        return;
      }

      await pool.query(
        "INSERT INTO public.Category (name, location_id) VALUES ($1, $2)",
        [name, locationId]
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
    }

    res.status(201).json({ message: "Category created." });
    return;
  }
);

router.delete(
  "/category/:id",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const resultQuery = await pool.query(
        "SELECT COUNT(*) FROM public.Product WHERE category_id = $1",
        [id]
      );

      const result: string = resultQuery.rows[0].count;

      const productCount = parseInt(result, 10);

      if (productCount > 0) {
        res.status(400).json({
          error:
            "Cannot delete category. There are products contained in this category.",
        });
        return;
      }

      await pool.query("DELETE FROM public.Category WHERE id = $1", [id]);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
      return;
    }

    res.status(200).json({ message: "Category deleted." });
    return;
  }
);

router.get(
  "/category",
  authenticateToken,
  checkManagerRole,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);

      const categoriesQuery = await pool.query(
        "SELECT * FROM public.Category WHERE location_id = $1",
        [locationId]
      );
      const categories: CategoryModel[] = categoriesQuery.rows;
      res.status(200).json(categories);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
    }
  }
);

//products

router.post(
  "/product",
  authenticateToken,
  checkManagerRole,
  upload.single("photo"),
  async (req: UploadProductRequest, res: Response) => {
    const productRequest = req.body;

    try {
      validateFields(
        {
          name: productRequest.name,
          ingredients: productRequest.ingredients,
          nutrients: productRequest.nutrients,
          allergens: productRequest.allergens,
          price: productRequest.price,
          categoryId: productRequest.categoryId,
          initialStatus: productRequest.initialStatus,
        },
        req.body as unknown as Body
      );

      if (!(await checkCategoryExistsById(pool, productRequest.categoryId))) {
        res.status(400).json({ error: "Category does not exist." });
        return;
      }

      const publicUrl = await addPhotoToCloud(req.file!);

      await pool.query(
        "INSERT INTO public.Product (name, ingredients, nutrients, allergens, price, category_id, initial_status, photo_url) VALUES ($1, $2, $3, $4, $5, $6, $7,  $8)",
        [
          productRequest.name,
          productRequest.ingredients,
          productRequest.nutrients,
          productRequest.allergens,
          productRequest.price,
          productRequest.categoryId,
          productRequest.initialStatus,
          publicUrl,
        ]
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
      return;
    }

    res.status(201).json({ message: "Product created." });
    return;
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
      categoryId,
      initialStatus,
    }: CreateProductDto = req.body;

    try {
      validateFields(
        {
          name,
          ingredients,
          nutrients,
          allergens,
          price,
          categoryId,
          initialStatus,
        },
        req.body
      );

      if (!(await checkCategoryExistsById(pool, categoryId))) {
        res.status(400).json({ error: "Category does not exist." });
        return;
      }

      await pool.query(
        "UPDATE public.Product SET name = $1, ingredients = $2, nutrients = $3, allergens = $4, price = $5, category_id = $6, initial_status = $7 WHERE id = $8",
        [
          name,
          ingredients,
          nutrients,
          allergens,
          price,
          categoryId,
          initialStatus,
          id,
        ]
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
      return;
    }

    res.status(200).json({ message: "Product updated." });
    return;
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
      }
      return;
    }

    res.status(200).json({ message: "Product deleted." });
    return;
  }
);

router.get(
  "/product",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const locationId = getLocationFromRequest(req);

      const categoriesWithProductsQuery = await pool.query(
        `
        SELECT 
          p.id AS "productId",
          p.name AS "productName",
          c.id AS "categoryId",
          c.name AS "categoryName"
        FROM 
          public.Product p
        JOIN 
          public.Category c
        ON 
          p.category_id = c.id
        WHERE 
          c.location_id = $1;
        `,
        [locationId]
      );
      const categoriesWithProducts: ManagerProductResponseDto[] =
        categoriesWithProductsQuery.rows;
      res.status(200).json(categoriesWithProducts);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
      return;
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
        "INSERT INTO public.User (username, role, password, location_id) VALUES ($1, $2, $3, $4)",
        [username, role, hashedPassword, locationId]
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
      return;
    }

    res.status(201).json({ message: "Employee created." });
    return;
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
        "SELECT id, username, role FROM public.User WHERE location_id = $1 AND role != 'manager'",
        [locationId]
      );

      res.status(200).json(employees.rows);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
      return;
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

      const locationsQuery = await pool.query(
        "SELECT * FROM public.Location WHERE id = $1",
        [locationId]
      );

      const location = locationsQuery.rows[0];

      res.status(200).json(location);
      return;
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
    }
  }
);

export default router;
