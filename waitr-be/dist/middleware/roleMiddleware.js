"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmployeeRole = exports.checkManagerRole = exports.checkAdminRole = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const checkAdminRole = (req, res, next) => {
    const user = jsonwebtoken_1.default.decode(req.headers.authorization.split(" ")[1]);
    if (user.role !== "admin") {
        res.status(403).json({ error: "Unauthorized." });
        res.send();
    }
    next();
};
exports.checkAdminRole = checkAdminRole;
const checkManagerRole = (req, res, next) => {
    const user = jsonwebtoken_1.default.decode(req.headers.authorization.split(" ")[1]);
    if (user.role !== "manager") {
        res.status(403).json({ error: "Unauthorized." });
        res.send();
    }
    next();
};
exports.checkManagerRole = checkManagerRole;
const checkEmployeeRole = (role) => {
    const validRoles = ["waiter", "cook", "barman", "barista"];
    return validRoles.includes(role);
};
exports.checkEmployeeRole = checkEmployeeRole;
