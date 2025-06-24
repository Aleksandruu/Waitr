import express, { Request, Response } from "express";
import { getLocationFromRequest } from "../middleware/managerMiddleware";
import { getLocationIdFromSlug } from "../middleware/customerMiddleware";
import pool from "../db";

const router = express.Router();

router.get("/location/settings/:slug", async (req: Request, res: Response) => {
  try {
    let locationId = "";
    if (req.params.slug && req.params.slug !== "undefined") {
      locationId = await getLocationIdFromSlug(pool, req.params.slug);
    } else {
      locationId = await getLocationFromRequest(req);
    }
    const settingsQuery = await pool.query(
      "SELECT slug, name, color, logo, logo_mime FROM public.Location WHERE id = $1",
      [locationId]
    );

    if (settingsQuery.rows.length === 0) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    const settings = settingsQuery.rows[0];

    const response = {
      slug: settings.slug,
      name: settings.name,
      color: settings.color,
      logo: settings.logo,
      logoMime: settings.logo_mime, // Transformăm `logo_mime` în `logoMime`
    };

    res.status(200).json(response);
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }
});

router.get("/check", async (req: Request, res: Response) => {
  res.status(200).json({ message: "merge" });
});

export default router;
