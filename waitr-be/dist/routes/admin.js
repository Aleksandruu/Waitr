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
const bcrypt_1 = __importDefault(require("bcrypt"));
const roleMiddleware_1 = require("../middleware/roleMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
router.get("/locations", authMiddleware_1.authenticateToken, roleMiddleware_1.checkAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationsQuery = yield db_1.default.query("SELECT id, slug, name FROM public.Location WHERE name != 'AdminLocation'");
        const locations = locationsQuery.rows;
        if (locations.length > 0) {
            res.status(200).json(locations);
            return;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
            return;
        }
    }
    res.status(403).json({ message: "No locations found" });
}));
router.get("/locations/:locationId", authMiddleware_1.authenticateToken, roleMiddleware_1.checkAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { locationId } = req.params;
        const locationQuery = yield db_1.default.query(`SELECT 
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
        const location = locationQuery.rows[0];
        if (location) {
            res.status(200).json(location);
            return;
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
            return;
        }
    }
    res.status(403).json({ message: "No location found with this id" });
}));
router.post("/locations", authMiddleware_1.authenticateToken, roleMiddleware_1.checkAdminRole, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { locationName, locationSlug, managerUsername, managerPassword, tables, } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(managerPassword, 10);
        const initialQueue = {
            ready: [],
            preparing: [],
            delivered: [],
            payed: Array.from({ length: tables }, (_, i) => i + 1),
        };
        const locationId = yield db_1.default.query("INSERT INTO public.Location (name, slug, tables, tables_queue) VALUES ($1, $2, $3, $4) RETURNING id ", [locationName, locationSlug, tables, initialQueue]);
        yield db_1.default.query("INSERT INTO public.User (name, role, password, location_id) VALUES ($1, $2, $3, $4)", [managerUsername, "manager", hashedPassword, locationId.rows[0].id]);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
            return;
        }
    }
    res.status(201).json({ message: "Manager created." });
}));
exports.default = router;
