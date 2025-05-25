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
exports.checkCategoryExistsById = exports.checkCategoryExistsByName = exports.getLocationFromRequest = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.JWT_SECRET_KEY;
const getLocationFromRequest = (req) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let locationId = "";
    jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
        if (err) {
            throw new Error("Invalid token");
        }
        const user = decoded;
        locationId = user.locationId;
    });
    return locationId;
};
exports.getLocationFromRequest = getLocationFromRequest;
const checkCategoryExistsByName = (pool, name, locationId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT COUNT(*) FROM public.Category WHERE name = $1 AND location_id = $2", [name, locationId]);
    return parseInt(result.rows[0].count, 10) > 0;
});
exports.checkCategoryExistsByName = checkCategoryExistsByName;
const checkCategoryExistsById = (pool, categoryId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT COUNT(*) FROM public.Category WHERE id = $1", [categoryId]);
    return parseInt(result.rows[0].count, 10) > 0;
});
exports.checkCategoryExistsById = checkCategoryExistsById;
