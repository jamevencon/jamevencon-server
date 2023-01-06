import { Request } from "express";
import { HttpHandler } from "..";
import { query, sqlSafe, User } from "../utils/db";

const parseUser = (req: Request) => {
  const { username, password }: { username: string; password: string } =
    req.body;
  return {
    username: sqlSafe(username),
    password: sqlSafe(password),
  };
};

export const register: HttpHandler = async (req, res) => {
  const { username, password } = parseUser(req);

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
  const { username, password } = parseUser(req);

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

export const deleteAccount: HttpHandler = async (req, res) => {
  const { username, password } = parseUser(req);

  const rows = (await query(
    `SELECT * FROM users WHERE username='${username}' AND password='${password}'`
  )) as User[];

  if (rows.length < 1) {
    res.send({ msg: "NOT_FOUND" });
    return;
  }

  await query(
    `DELETE FROM users WHERE username='${username}' AND password='${password}'`
  );
  res.send({ msg: "SUCCESS" });
};
