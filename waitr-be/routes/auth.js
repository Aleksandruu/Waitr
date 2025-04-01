const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");

const { Pool } = require("pg");
const e = require("express");
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await pool.query("SELECT * FROM public.User WHERE name = $1", [
      username,
    ]);

    if (user.rows.length > 0) {
      const validPassword = await bcrypt.compare(
        password,
        user.rows[0].password
      );
      if (validPassword) {
        const accessToken = jwt.sign(
          {
            name: username,
            role: user.rows[0].role,
            locationId: user.rows[0].location_id,
          },
          process.env.JWT_SECRET_KEY
        );
        return res.status(200).json({ accessToken });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  return res.status(403).json({ message: "Invalid username or password" });
});

module.exports = router;
