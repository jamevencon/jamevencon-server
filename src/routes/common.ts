import { HttpHandler } from "./../index";

export const root: HttpHandler = (req, res) => {
  res.send("Hello World");
};

export const ping: HttpHandler = (req, res) => {
  res.send({
    status: "online",
  });
};
