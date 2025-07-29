import { Role, UserModel } from "types";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const checkAdminRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: UserModel = jwt.decode(
    req.headers.authorization!.split(" ")[1]
  ) as UserModel;
  if (user.role !== "admin") {
    res.status(403).json({ error: "Unauthorized." });
  }
  next();
};

export const checkManagerRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: UserModel = jwt.decode(
    req.headers.authorization!.split(" ")[1]
  ) as UserModel;
  if (user.role !== "manager") {
    res.status(403).json({ error: "Unauthorized." });
  }
  next();
};

export const checkWaiterRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: UserModel = jwt.decode(
    req.headers.authorization!.split(" ")[1]
  ) as UserModel;
  if (user.role !== "waiter") {
    res.status(403).json({ error: "Unauthorized." });
  }
  next();
};

export const checkEmployeeRole = (role: Role) => {
  const validRoles = ["waiter", "cook", "barman", "barista"];
  return validRoles.includes(role);
};

export const checkStaffRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: UserModel = jwt.decode(
    req.headers.authorization!.split(" ")[1]
  ) as UserModel;
  const staffRoles = ["cook", "barman", "barista"];
  if (!staffRoles.includes(user.role)) {
    res.status(403).json({ error: "Unauthorized. Staff role required." });
    return;
  }
  next();
};
