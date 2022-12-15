import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { ping, root } from "./routes/common";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5656;

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
