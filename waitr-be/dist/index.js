"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const manager_1 = __importDefault(require("./routes/manager"));
const customer_1 = __importDefault(require("./routes/customer"));
const waiter_1 = __importDefault(require("./routes/waiter"));
const common_1 = __importDefault(require("./routes/common"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const sockets_1 = require("./sockets");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
(0, sockets_1.initSocket)(server);
const io = (0, sockets_1.getIo)();
io.on("connection", (socket) => {
    console.log("Socket conectat:", socket.id);
    socket.on("join-location", (locationId) => {
        socket.join(`waiter-${locationId}`);
        console.log(`Socket ${socket.id} joined waiter-${locationId}`);
    });
    socket.on("disconnect", () => {
        console.log("Socket deconectat:", socket.id);
    });
});
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true,
}));
app.use("/auth", auth_1.default);
app.use("/admin", admin_1.default);
app.use("/manager", manager_1.default);
app.use("/customer", customer_1.default);
app.use("/waiter", waiter_1.default);
app.use("/common", common_1.default);
server.listen(port, () => {
    console.log(`App runningg on port ${port}.`);
});
