import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { ping, root } from "./routes/common";
import cors, { CorsOptions } from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5656;

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

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
