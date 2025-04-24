import jwt from "jsonwebtoken";
import { User } from "../../../shared/models/user.model";
import { Pool } from "pg";

const secretKey = process.env.JWT_SECRET_KEY;

interface RequestWithAuthorization {
  headers: {
    authorization?: string;
  };
}

export const getLocationFromRequest = (
  req: RequestWithAuthorization
): string => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  let locationId = "";
  jwt.verify(token!, secretKey!, (err, decoded) => {
    if (err) {
      throw new Error("Invalid token");
    }
    const user = decoded as User;
    locationId = user.locationId;
  });
  return locationId;
};

export const checkCategoryExistsByName = async (
  pool: Pool,
  name: string,
  locationId: string
) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM public.Category WHERE name = $1 AND location_id = $2",
    [name, locationId]
  );

  return parseInt(result.rows[0].count, 10) > 0;
};

export const checkCategoryExistsById = async (
  pool: Pool,
  categoryId: string
) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM public.Category WHERE id = $1",
    [categoryId]
  );

  return parseInt(result.rows[0].count, 10) > 0;
};
