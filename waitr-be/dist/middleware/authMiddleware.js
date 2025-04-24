"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET_KEY;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "No token provided." });
    }
    else {
        jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
            if (err)
                res.status(403).json({ error: "Invalid token." });
            req.user = user;
            next();
        });
    }
};
exports.authenticateToken = authenticateToken;
