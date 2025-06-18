import { Pool } from "pg";
import { Request, Response, NextFunction } from "express";
import pool from "../db";

export const getLocationIdFromSlug = async (
  pool: Pool,
  slug: string
): Promise<string> => {
  const result = await pool.query(
    "SELECT * FROM public.Location WHERE slug = $1",
    [slug]
  );

  if (result.rows.length === 0) {
    throw new Error(`Location with slug '${slug}' not found`);
  }

  return result.rows[0].id;
};

export const checkLocationActive = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const locationSlug = req.params.locationSlug;

    if (!locationSlug) {
      res.status(400).json({ error: "Location slug is required" });
      return;
    }

    const result = await pool.query(
      "SELECT * FROM public.Location WHERE slug = $1",
      [locationSlug]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Location not found" });
      return;
    }

    const location = result.rows[0];

    if (!location.active) {
      res.status(404).json({ error: "Location is not active" });
      return;
    }

    next();
  } catch (error) {
    console.error("Error checking location active status:", error);
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
