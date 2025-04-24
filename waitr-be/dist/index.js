"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const pg_1 = require("pg");
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// import managerRouter from "./src/routes/manager";
// import customerRoutes from "./src/routes/customer";
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
// initSocket(server);
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});
app.use("/auth", auth_1.default);
app.use("/admin", admin_1.default);
// app.use("/manager", managerRouter);
// app.use("/customer", customerRoutes);
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
