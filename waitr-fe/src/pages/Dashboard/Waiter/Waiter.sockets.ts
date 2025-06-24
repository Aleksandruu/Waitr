import { io } from "socket.io-client";

const URL = import.meta.env.VITE_APP_API_URL;

const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export const connectWaiterSocket = (
  locationId: string,
  onOrderPing: (table: number) => void
) => {
  const roomName = `waiter-${locationId}`;

  socket.emit("join-location", roomName);

  socket.off("order-ping");

  socket.on("order-ping", (data: { table: number }) => {
    onOrderPing(data.table);
  });
};

export default socket;
