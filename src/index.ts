import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { ping, root } from "./routes/common";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { Server } from "socket.io";
import { createServer } from "http";
import { initSocket } from "./socket/socket";
import { createConnection } from "mysql";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "./utils/db";
import { info } from "./utils/log";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5656;

export const DB = createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

console.log("Connecting to database");
DB.connect();
console.log("Connected to database.");

const whitelist = [
  "http://localhost",
  "http://localhost:3000",
  "http://damascus.kro.kr",
  "http://damascus.kro.kr:3000",
  "https://damascus.kro.kr",
];
const corsOption: CorsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin || "-1") !== -1) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
};

app.use(cors(corsOption));

const logStream = fs.createWriteStream(
  path.join(
    __dirname,
    `/../log/${new Date().toLocaleDateString("ko-KR").replace(/. /gi, "_")}log`
  ),
  {
    flags: "a",
  }
);
app.use(
  morgan(
    "[:date[clf]] :remote-addr ':method' ':url' :status :res[content-length] :response-time (ms)",
    {
      stream: logStream,
    }
  )
);

export type HttpHandler = (req: Request, res: Response) => any;

const get = (url: string, handler: HttpHandler) => {
  app.get(url, handler);
  console.log(`[GET] ${url}`);
};

const post = (url: string, handler: HttpHandler) => {
  app.post(url, handler);
  console.log(`[POST] ${url}`);
};

get("/", root);
get("/ping", ping);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (whitelist.indexOf(origin || "-1") !== -1) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
  },
});

initSocket(io);

server.listen(port, () => {
  info(`Server is running at http://localhost:${port}`);
});
