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
exports.checkLocationActive = exports.getLocationIdFromSlug = void 0;
const db_1 = __importDefault(require("../db"));
const getLocationIdFromSlug = (pool, slug) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM public.Location WHERE slug = $1", [slug]);
    if (result.rows.length === 0) {
        throw new Error(`Location with slug '${slug}' not found`);
    }
    return result.rows[0].id;
});
exports.getLocationIdFromSlug = getLocationIdFromSlug;
const checkLocationActive = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationSlug = req.params.locationSlug;
        if (!locationSlug) {
            res.status(400).json({ error: "Location slug is required" });
            return;
        }
        const result = yield db_1.default.query("SELECT * FROM public.Location WHERE slug = $1", [locationSlug]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Location not found" });
            return;
        }
        const location = result.rows[0];
        if (!location.active) {
            res.status(404).json({ error: "Location is not active" });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Error checking location active status:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
});
exports.checkLocationActive = checkLocationActive;
