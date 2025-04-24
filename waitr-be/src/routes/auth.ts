import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { LoginRequest } from "../../../shared/models/login.request.model";
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body as LoginRequest;
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
          process.env.JWT_SECRET_KEY!
        );
        res.status(200).json({ accessToken });
        res.send();
        return;
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
      res.send();
      return;
    }
  }

  res.status(403).json({ message: "Invalid username or password" });
  res.send();
});

export default router;
