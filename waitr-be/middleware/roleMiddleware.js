const Roles = require("../models/roles.enum");

function checkAdminRole(req, res, next) {
  if (req.user.role !== Roles.ADMIN) return res.sendStatus(403);
  next();
}

function checkManagerRole(req, res, next) {
  if (req.user.role !== Roles.MANAGER) return res.sendStatus(403);
  next();
}

function checkEmployeeRole(role) {
  const validRoles = [Roles.WAITER, Roles.BARISTA, Roles.COOK, Roles.BARTENDER];
  return validRoles.includes(role);
}

module.exports = {
  checkAdminRole,
  checkManagerRole,
  checkEmployeeRole,
};
