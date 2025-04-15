const express = require("express");
const router = express.Router();
const { checkAdminRole } = require("../middleware/roleMiddleware");
const { authenticateToken } = require("../middleware/authMiddleware");
const bcrypt = require("bcrypt");
const Roles = require("../models/roles.enum");

const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

router.get(
  "/locations",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    try {
      const locations = await pool.query(
        "SELECT * FROM public.Location WHERE name != 'AdminLocation'"
      );
      if (locations.rows.length > 0) {
        return res.status(200).json(locations.rows);
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }

    return res.status(403).json({ message: "No locations found" });
  }
);

router.get(
  "/locations/:locationId",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    try {
      const { locationId } = req.params;
      const location = await pool.query(
        `SELECT 
          l.id AS id,
          l.name AS name,
          l.slug AS slug,
        COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', u.id,
                'name', u.name,
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
      if (location.rows.length > 0) {
        return res.status(200).json(location.rows[0]);
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }

    return res.status(403).json({ message: "No location found with this id" });
  }
);

router.post(
  "/locations",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    try {
      const { locationName, locationSlug, managerUsername, managerPassword } =
        req.body;
      const hashedPassword = await bcrypt.hash(managerPassword, 10);

      const locationId = await pool.query(
        "INSERT INTO public.Location (name, slug) VALUES ($1, $2) RETURNING id ",
        [locationName, locationSlug]
      );

      await pool.query(
        "INSERT INTO public.User (name, role, password, location_id) VALUES ($1, $2, $3, $4)",
        [managerUsername, Roles.MANAGER, hashedPassword, locationId.rows[0].id]
      );
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ message: "Manager created." });
  }
);

module.exports = router;
