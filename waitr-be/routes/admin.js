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

router.post("/manager", authenticateToken, checkAdminRole, async (req, res) => {
  try {
    const { name, password, location, slug } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const locationId = await pool.query(
      "INSERT INTO public.Location (name, slug) VALUES ($1, $2) RETURNING id ",
      [location, slug]
    );

    await pool.query(
      "INSERT INTO public.User (name, role, password, location_id) VALUES ($1, $2, $3, $4)",
      [name, Roles.MANAGER, hashedPassword, locationId.rows[0].id]
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ message: "Manager created." });
});

module.exports = router;
