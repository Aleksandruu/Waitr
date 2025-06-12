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
  console.log(`Waiter attempting to join room: ${roomName}`);

  socket.off("order-ping"); // evită adăugarea multiplă
  socket.on("order-ping", (data: { table: number }) => {
    console.log("Primit order-ping de la socket:", data);
    onOrderPing(data.table);
  });
};

export default socket;
