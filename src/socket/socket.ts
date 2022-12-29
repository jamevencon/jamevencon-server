import { Server } from "socket.io";
import { GET_USERS, Hello, HELLO, WELCOME } from "./socket.type";
import { Socket } from "socket.io";
import { info } from "../utils/log";

interface User {
  socket: Socket;
  username: string | undefined;
}

const users = new Map<string, User>();

export const initSocket = (io: Server) => {
  io.on("connection", (socket) => {
    const id = socket.id;
    users.set(id, { socket, username: undefined });

    socket.on("disconnect", () => {
      users.delete(id);
      info(`Disconnect: ${id}`);
    });

    socket.on(HELLO, ({ username }: Hello) => {
      users.set(id, {
        socket: users.get(id)!.socket,
        username: username,
      });

      info(`New Socket: ${id} (${username})`);
      users.get(id)!.socket.emit(WELCOME);
    });

    socket.on(GET_USERS, () => {
      socket.emit(GET_USERS, {
        usernames: [...users.values()].map((v) => v.username),
      });
    });
  });
};
