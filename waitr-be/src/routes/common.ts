import express, { Request, Response } from "express";
import { Pool } from "pg";
import { getLocationFromRequest } from "../middleware/managerMiddleware";

const router = express.Router();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

//location

router.get("/location/settings", async (req: Request, res: Response) => {
  try {
    const locationId = getLocationFromRequest(req);
    console.log("Location ID:", locationId);
    const settingsQuery = await pool.query(
      "SELECT slug, name, color, logo, logo_mime FROM public.Location WHERE id = $1",
      [locationId]
    );

    if (settingsQuery.rows.length === 0) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    const settings = settingsQuery.rows[0];
    res.status(200).json(settings);
    return;
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
      return;
    }
  }
});

export default router;
