/**
 * @fileoverview
 * Provides a logger for scripts.
 */

import process from "node:process";

function clearLine() {
  const emptyLine = " ".repeat(process.stdout.columns);

  process.stdout.write("\r");
  process.stdout.write(emptyLine);
  process.stdout.write("\r");
}

function newline() {
  process.stdout.write("\n");
}

function print(s) {
  process.stdout.write(s);
}

function println(s) {
  print(s);
  newline();
}

function reprint(s) {
  clearLine();
  print(s);
}

function reprintln(s) {
  reprint(s);
  newline();
}

export default {
  newline,
  print,
  println,
  reprint,
  reprintln,
};
