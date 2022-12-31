import { HttpHandler } from "..";
import { query, User } from "../utils/db";

export const register: HttpHandler = async (req, res) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  const rows = (await query(
    `SELECT * FROM users WHERE username='${username}'`
  )) as User[];

  if (rows.length > 0) {
    res.send({
      msg: "TAKEN_USERNAME",
    });
    return;
  }

  await query(
    `INSERT INTO users (username, password) VALUES ('${username}', '${password}')`
  );

  res.send({
    msg: "SUCCESS",
  });
};

export const login: HttpHandler = async (req, res) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  const rows = (await query(
    `SELECT * FROM users WHERE username='${username}' AND password='${password}'`
  )) as User[];

  if (rows.length > 0) {
    res.send({ msg: "SUCCESS" });
    return;
  } else {
    res.send({ msg: "FAILURE" });
    return;
  }
};
