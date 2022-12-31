import { Server } from "socket.io";
import {
  GET_USERS,
  Hello,
  HELLO,
  KICK_AND_LOGIN,
  OTHER_LOGIN,
  WELCOME,
} from "./socket.type";
import { Socket } from "socket.io";
import { info, warn } from "../utils/log";

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
      if (
        Array.from(users.values())
          .map((v) => v.username)
          .includes(username)
      ) {
        // Multiple login detected.
        const originalSocket = Array.from(users.values()).filter(
          (v) => v.username === username
        )[0].socket;
        originalSocket.emit(OTHER_LOGIN);

        users.delete(originalSocket.id);
        socket.emit(KICK_AND_LOGIN);
        warn(`Force logout by multiple client: ${username}`);
      }

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
