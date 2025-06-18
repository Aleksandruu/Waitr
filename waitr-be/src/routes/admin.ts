import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { checkAdminRole } from "../middleware/roleMiddleware";
import { authenticateToken } from "../middleware/authMiddleware";
import { LocationResponseDto } from "shared";
import pool from "../db";

const router = express.Router();

router.get(
  "/locations",
  authenticateToken,
  checkAdminRole,
  async (req: Request, res: Response) => {
    try {
      const locationsQuery = await pool.query(
        "SELECT id, slug, name, active FROM public.Location WHERE name != 'AdminLocation'"
      );

      const locations: LocationResponseDto[] = locationsQuery.rows;

      if (locations.length > 0) {
        res.status(200).json(locations);
        return;
      }
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
        return;
      }
    }

    res.status(403).json({ message: "No locations found" });
  }
);

router.get(
  "/locations/:locationId",
  authenticateToken,
  checkAdminRole,
  async (req: Request, res: Response) => {
    try {
      const { locationId } = req.params;

      const locationQuery = await pool.query(
        `SELECT 
          l.id AS id,
          l.name AS name,
          l.slug AS slug,
          l.active AS active,
        COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', u.id,
                'name', u.username,
                'role', u.role
            )
        ) FILTER (WHERE u.id IS NOT NULL), 
        '[]'
        ) AS staff
        FROM 
          public.Location l
        LEFT JOIN 
          public.User u ON l.id = u.location_id
        WHERE 
          l.id = $1
        GROUP BY 
          l.id;`,
        [locationId]
      );
      const location: LocationResponseDto = locationQuery.rows[0];
      if (location) {
        res.status(200).json(location);
        return;
      }
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
        return;
      }
    }

    res.status(403).json({ message: "No location found with this id" });
  }
);

router.post(
  "/locations",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    try {
      const {
        locationName,
        locationSlug,
        managerUsername,
        managerPassword,
        tables,
      } = req.body;
      const hashedPassword = await bcrypt.hash(managerPassword, 10);

      const locationId = await pool.query(
        "INSERT INTO public.Location (name, slug, tables, color) VALUES ($1, $2, $3, $4) RETURNING id ",
        [locationName, locationSlug, tables, "hsl(178, 65%, 26%)"]
      );

      await pool.query(
        "INSERT INTO public.User (username, role, password, location_id) VALUES ($1, $2, $3, $4)",
        [managerUsername, "manager", hashedPassword, locationId.rows[0].id]
      );
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
      }
    }

    res.status(201).json({ message: "Manager created." });
  }
);

router.patch(
  "/locations/:locationId/active",
  authenticateToken,
  checkAdminRole,
  async (req: Request, res: Response) => {
    try {
      const { locationId } = req.params;
      const { active } = req.body;

      if (typeof active !== "boolean") {
        res
          .status(400)
          .json({ error: "Active status must be a boolean value" });
        return;
      }

      const updateQuery = await pool.query(
        "UPDATE public.Location SET active = $1 WHERE id = $2 RETURNING id, name, slug, active",
        [active, locationId]
      );

      if (updateQuery.rowCount === 0) {
        res.status(404).json({ error: "Location not found" });
        return;
      }

      res.status(200).json({
        message: `Location ${active ? "activated" : "deactivated"} successfully`,
        location: updateQuery.rows[0],
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).json({ error: err.message });
        return;
      }
    }
  }
);

export default router;
