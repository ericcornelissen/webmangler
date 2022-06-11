/**
 * @fileoverview
 * Provides a way to execute other programs.
 */

import * as cp from "node:child_process";
import process from "node:process";

function tryLogError(error) {
  if (error.stdout) {
    const errorMsg = error.stdout.toString();
    console.error("\n", errorMsg); // eslint-disable-line no-console
  }
}

export default function execSync(command, args, options) {
  try {
    cp.execFileSync(command, args, options);
  } catch (error) {
    tryLogError(error);
    process.exit(1);
  }
}
