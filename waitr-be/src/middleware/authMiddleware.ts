import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET_KEY;

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No token provided." });
  } else {
    jwt.verify(token, secretKey as string, (err, user) => {
      if (err) res.status(403).json({ error: "Invalid token." });
      req.user = user;
      next();
    });
  }
};
