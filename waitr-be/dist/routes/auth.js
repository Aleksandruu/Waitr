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
exports.pool = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield exports.pool.query("SELECT * FROM public.User WHERE name = $1", [
            username,
        ]);
        if (user.rows.length > 0) {
            const validPassword = yield bcrypt_1.default.compare(password, user.rows[0].password);
            if (validPassword) {
                const accessToken = jsonwebtoken_1.default.sign({
                    name: username,
                    role: user.rows[0].role,
                    locationId: user.rows[0].location_id,
                }, process.env.JWT_SECRET_KEY);
                res.status(200).json({ accessToken });
                res.send();
                return;
            }
        }
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
            res.send();
            return;
        }
    }
    res.status(403).json({ message: "Invalid username or password" });
    res.send();
}));
exports.default = router;
