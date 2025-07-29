import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";
import managerRouter from "./routes/manager";
import customerRoutes from "./routes/customer";
import waiterRouter from "./routes/waiter";
import staffRouter from "./routes/staff";
import commonRouter from "./routes/common";

import dotenv from "dotenv";
import http from "http";
import { getIo, initSocket } from "./sockets";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
initSocket(server);

const io = getIo();

io.on("connection", (socket) => {
  console.log("Socket conectat:", socket.id);

  socket.on("join-location", (roomName: string) => {
    socket.join(roomName);
    console.log(`Socket ${socket.id} joined ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log("Socket deconectat:", socket.id);
  });
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://waitr-djfkfhdwgvete8cg.westeurope-01.azurewebsites.net",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/auth", authRouter);
app.use("/admin", adminRouter);
app.use("/manager", managerRouter);
app.use("/customer", customerRoutes);
app.use("/waiter", waiterRouter);
app.use("/staff", staffRouter);
app.use("/common", commonRouter);

server.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
