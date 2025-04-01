const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

const getLocationFromRequest = (req) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  let locationId = "";
  jwt.verify(token, secretKey, (err, user) => {
    locationId = user.locationId;
  });
  return locationId;
};

const checkCategoryExistsByName = async (pool, name, locationId) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM public.Category WHERE name = $1 AND location_id = $2",
    [name, locationId]
  );

  return parseInt(result.rows[0].count, 10) > 0;
};

const checkCategoryExistsById = async (pool, categoryId) => {
  const result = await pool.query(
    "SELECT COUNT(*) FROM public.Category WHERE id = $1",
    [categoryId]
  );

  return parseInt(result.rows[0].count, 10) > 0;
};

module.exports = {
  checkCategoryExistsByName,
  checkCategoryExistsById,
  getLocationFromRequest,
};
