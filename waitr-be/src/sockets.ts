import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://waitr-djfkfhdwgvete8cg.westeurope-01.azurewebsites.net",
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
