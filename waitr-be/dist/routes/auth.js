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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const userQuery = yield db_1.default.query("SELECT * FROM public.User WHERE username = $1", [username]);
        if (userQuery.rows.length > 0) {
            const user = userQuery.rows[0];
            const validPassword = yield bcrypt_1.default.compare(password, user.password);
            if (validPassword) {
                const accessToken = jsonwebtoken_1.default.sign({
                    name: username,
                    role: user.role,
                    locationId: user.location_id,
                }, process.env.JWT_SECRET_KEY);
                res.status(200).json({ accessToken });
            }
        }
    }
    catch (err) {
        res.status(500).json({ error: err });
    }
    res.status(403).json({ message: "Invalid username or password" });
}));
exports.default = router;
