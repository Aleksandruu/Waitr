const getLocationIdFromSlug = async (pool, slug) => {
  const result = await pool.query(
    "SELECT * FROM public.Location WHERE slug = $1",
    [slug]
  );

  return result.rows[0].id;
};

module.exports = {
  getLocationIdFromSlug,
};
