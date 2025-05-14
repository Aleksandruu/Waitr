import { Pool } from "pg";

export const getLocationIdFromSlug = async (
  pool: Pool,
  slug: string
): Promise<string> => {
  const result = await pool.query(
    "SELECT * FROM public.Location WHERE slug = $1",
    [slug]
  );

  return result.rows[0].id;
};
