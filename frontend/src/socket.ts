import { io } from "socket.io-client";
import config from "./config";

// Single socket instance shared across the whole app
export const socket = io(config.SOCKET_URL, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

socket.on("error", (error) => {
  console.error("Socket error:", error);
});
