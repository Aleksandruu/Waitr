import express from "express";
import bodyParser from "body-parser";
import { Pool } from "pg";
import cors from "cors";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import managerRouter from "./routes/manager";
import customerRoutes from "./routes/customer";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./sockets";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend origin
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
});

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/manager", managerRouter);
app.use("/customer", customerRoutes);

server.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
