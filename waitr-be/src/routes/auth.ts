import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { LoginRequest, UserModel } from "shared";
import pool from "../db";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/login", async (req: Request, res: Response) => {
  const { username, password }: LoginRequest = req.body;
  try {
    const userQuery = await pool.query(
      "SELECT * FROM public.User WHERE username = $1",
      [username]
    );

    if (userQuery.rows.length > 0) {
      const user: UserModel = userQuery.rows[0];
      const validPassword = await bcrypt.compare(password, user.password!);
      if (validPassword) {
        const accessToken = jwt.sign(
          {
            name: username,
            role: user.role,
            locationId: user.location_id,
          },
          process.env.JWT_SECRET_KEY!
        );
        res.status(200).json({ accessToken });
        return;
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
      return;
    }
  }

  res.status(403).json({ message: "Invalid username or password" });
});

export default router;
