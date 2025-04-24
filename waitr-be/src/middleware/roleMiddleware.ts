import { User } from "../../../shared/models/user.model";
import { Role } from "../../../shared/models/role.model";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkAdminRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = jwt.decode(
    req.headers.authorization!.split(" ")[1]
  ) as User;
  if (user.role !== "admin") {
    res.status(403).json({ error: "Unauthorized." });
    res.send();
  }
  next();
};

export const checkManagerRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = jwt.decode(
    req.headers.authorization!.split(" ")[1]
  ) as User;
  if (user.role !== "manager") {
    res.status(403).json({ error: "Unauthorized." });
    res.send();
  }
  next();
};

export const checkEmployeeRole = (role: Role) => {
  const validRoles = ["waiter", "cook", "barman", "barista"];
  return validRoles.includes(role);
};
