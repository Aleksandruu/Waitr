"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const bcrypt_1 = __importDefault(require("bcrypt"));
const { Pool } = require("pg");
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
});
const router = express_1.default.Router();
router.get("/locations", authMiddleware_1.authenticateToken, roleMiddleware_1.checkAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locations = yield pool.query("SELECT * FROM public.Location WHERE name != 'AdminLocation'");
        if (locations.rows.length > 0) {
            res.status(200).json(locations.rows);
            res.send();
            return;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
            res.send();
            return;
        }
    }
    res.status(403).json({ message: "No locations found" });
    res.send();
}));
router.get("/locations/:locationId", authMiddleware_1.authenticateToken, roleMiddleware_1.checkAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { locationId } = req.params;
        const location = yield pool.query(`SELECT 
          l.id AS id,
          l.name AS name,
          l.slug AS slug,
        COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', u.id,
                'name', u.name,
                'role', u.role
            )
        ) FILTER (WHERE u.id IS NOT NULL), 
        '[]'
        ) AS staff
        FROM 
          public.Location l
        LEFT JOIN 
          public.User u ON l.id = u.location_id
        WHERE 
          l.id = $1
        GROUP BY 
          l.id;`, [locationId]);
        if (location.rows.length > 0) {
            res.status(200).json(location.rows[0]);
            res.send();
            return;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
            res.send();
            return;
        }
    }
    res.status(403).json({ message: "No location found with this id" });
    res.send();
}));
router.post("/locations", authMiddleware_1.authenticateToken, roleMiddleware_1.checkAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { locationName, locationSlug, managerUsername, managerPassword } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(managerPassword, 10);
        const locationId = yield pool.query("INSERT INTO public.Location (name, slug) VALUES ($1, $2) RETURNING id ", [locationName, locationSlug]);
        yield pool.query("INSERT INTO public.User (name, role, password, location_id) VALUES ($1, $2, $3, $4)", [managerUsername, "manager", hashedPassword, locationId.rows[0].id]);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
            res.send();
            return;
        }
    }
    res.status(201).json({ message: "Manager created." });
    res.send();
}));
exports.default = router;
