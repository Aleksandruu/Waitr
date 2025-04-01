const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET_KEY;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401).json({ error: "No token provided." });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403).json({ error: "Invalid token." });
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
};
