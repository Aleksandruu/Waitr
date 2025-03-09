const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

const secretKey = process.env.JWT_SECRET_KEY;

const { Pool } = require("pg");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function checkAdminRole(req, res, next) {
  if (req.user.role !== "admin") return res.sendStatus(403);
  next();
}

function checkManagerRole(req, res, next) {
  if (req.user.role !== "manager") return res.sendStatus(403);
  next();
}

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
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO public.User (name, role, password) VALUES ($1, 'manager', $2)",
      [username, hashedPassword]
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
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO public.User (name, role, password) VALUES ($1, $2, $3)",
      [username, role, hashedPassword]
    );
    res.sendStatus(201);
  }
);

module.exports = router;
