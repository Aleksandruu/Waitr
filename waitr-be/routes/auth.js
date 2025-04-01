const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  checkAdminRole,
  checkManagerRole,
  checkEmployeeRole,
} = require("../middleware/roleMiddleware");
const Roles = require("../models/roles.enum");

const secretKey = process.env.JWT_SECRET_KEY;

const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await pool.query("SELECT * FROM public.User WHERE name = $1", [
    username,
  ]);

  if (user.rows.length > 0) {
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (validPassword) {
      const accessToken = jwt.sign(
        { name: username, role: user.rows[0].role },
        secretKey
      );
      return res.json({ accessToken });
    }
  }
  res.sendStatus(403);
});

router.post(
  "/create-manager",
  authenticateToken,
  checkAdminRole,
  async (req, res) => {
    console.log("fdsfd");
    const { username, password, location } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO public.User (name, role, password, location) VALUES ($1, $2, $3, $4)",
      [username, Roles.MANAGER, hashedPassword, location]
    );
    res.sendStatus(201);
  }
);

router.post(
  "/create-employee",
  authenticateToken,
  checkManagerRole,
  async (req, res) => {
    const { username, role, password } = req.body;
    const location = "";
    if (!checkEmployeeRole(role)) {
      return res.status(400).json({ error: "Invalid role for employee" });
    }
    jwt.verify(token, secretKey, (err, user) => {
      location = user.location;
    });
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO public.User (name, role, password, location) VALUES ($1, $2, $3, $4)",
      [username, role, hashedPassword, location]
    );
    res.sendStatus(201);
  }
);

module.exports = router;
