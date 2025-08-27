import { io } from "socket.io-client";
import { Role } from "types";

const URL = process.env.NEXT_PUBLIC_API_URL;

const socket = io(URL, {
  withCredentials: true,
  transports: ["websocket"],
});

export const connectStaffSocket = (
  locationId: string,
  userRole: Role,
  onOrderPing: () => void
) => {
  // Only join room if user is staff (cook, barman, barista)
  if (["cook", "barman", "barista"].includes(userRole)) {
    const roomName = `${userRole}-${locationId}`;
    socket.emit("join-location", roomName);

    socket.off("order-ping"); // evită adăugarea multiplă
    socket.on("order-ping", (data: { table: number }) => {
      onOrderPing();
    });
  }
};

export default socket;
