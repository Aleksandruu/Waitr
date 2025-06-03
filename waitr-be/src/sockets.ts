import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [
        process.env.CORS_ORIGIN || "https://waitr-6728.vercel.app",
        "localhost:3000",
      ],
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
