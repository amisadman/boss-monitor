import { io, Socket } from "socket.io-client";

// Reuse a single socket connection across the whole app.
let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(import.meta.env.VITE_API_URL, {
      // Your backend calls getIO() with default socket.io setup, so the
      // default transports work fine. Add auth/query options here if your
      // server requires them later.
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("[socket] connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[socket] disconnected:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[socket] connect_error:", err.message);
    });
  }

  return socket;
}
