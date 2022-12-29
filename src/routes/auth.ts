import { DB, HttpHandler } from "..";

export const register: HttpHandler = async (req, res) => {
  const { username, password }: { username: string; password: string } =
    req.body;

  await DB.query(`SELECT * FROM users WHERE username=${username}`);
};
