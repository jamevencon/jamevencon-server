import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { ping, root } from "./routes/common";
import cors, { CorsOptions } from "cors";
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
  initDb,
} from "./utils/db";
import { debug, info, success, error } from "./utils/log";
import cookieParser from "cookie-parser";
import { waitForDebugger } from "inspector";

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

debug("Connecting to database");
DB.connect();
success("Connected to database.");
initDb();

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
app.use(cookieParser());

app.use((req, res, next) => {
  info(`[${req.method}] ${req.ip} ${req.path}`);
  next();
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  error(`[${req.method}] ${req.ip} ${req.path}`);
  error(err.stack || err.message);
});

export type HttpHandler = (req: Request, res: Response) => any;

const get = (url: string, handler: HttpHandler) => {
  app.get(url, handler);
  success(`[GET] ${url}`);
};

const post = (url: string, handler: HttpHandler) => {
  app.post(url, handler);
  success(`[POST] ${url}`);
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
