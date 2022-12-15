import { Server } from "socket.io";

export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    socket.on("message", ({ name, message }) => {
      io.emit("message", { name, message });
    });
  });
};
