import { appendFileSync } from "fs";
// import chalk from "chalk";
import colors from "colors";

const append = (text: string) => {
  const path =
    "./log/" +
    new Date().toLocaleDateString("ko-KR").replace(/. /gi, "_") +
    "log";

  appendFileSync(path, text + "\n");
};

const make2digit = (v: number) => {
  if (v >= 10) return `${v}`;
  else return `0${v}`;
};

const getTimestamp = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `[${year}.${month}.${day} ${make2digit(hour)}:${make2digit(
    min
  )}:${make2digit(sec)}]`;
};

export const info = (text: string) => {
  append(getTimestamp() + "[info]" + text);
  console.log(colors.grey(getTimestamp()) + "[info] " + text);
};

export const warn = (text: string) => {
  append(getTimestamp() + "[warn]" + text);
  console.log(
    colors.grey(getTimestamp()) + colors.bgYellow("[warn]") + " " + text
  );
};

export const success = (text: string) => {
  append(getTimestamp() + "[success]" + text);
  console.log(colors.grey(getTimestamp()) + colors.green("[success] ") + text);
};

export const error = (text: string) => {
  append(getTimestamp() + "[err]" + text);
  console.log(colors.grey(getTimestamp()) + colors.bgRed("[err]") + " " + text);
};

export const debug = (text: string) => {
  append(getTimestamp() + "[debug]" + text);
  console.log(colors.grey(getTimestamp()) + colors.grey("[debug] ") + text);
};

export const queryLog = (text: string) => {
  append(getTimestamp() + "[query]" + text);
};
