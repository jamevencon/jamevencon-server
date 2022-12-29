import { MysqlError } from "mysql";
import { promisify } from "util";
import { DB } from "..";
import { debug, error } from "./log";

export const DB_HOST = process.env.DB_HOST || "localhost";
export const DB_PORT =
  (process.env.DB_PORT && parseInt(process.env.DB_PORT)) || 3306;
export const DB_USER = process.env.DB_USER || "jameven";
export const DB_PASSWORD = process.env.DB_PASSWORD || "jamevencon";
export const DB_DATABASE = process.env.DB_DATABASE || "jamevencon";

export const query = async (query: string) => {
  const q = promisify(DB.query).bind(DB);

  try {
    return await q(query);
  } catch (e) {
    error((e as Error).toString());
  }
};

export interface User {
  id: number;
  username: string;
  password: string;
  bio: string;
  created_at: Date;
  updated_at: Date;
}

export const initDb = async () => {
  debug("Initiating Database");
  await query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username varchar(20) NOT NULL UNIQUE,
    password varchar(200) NOT NULL,
    bio varchar(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
};
