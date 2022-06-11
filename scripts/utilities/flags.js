/**
 * @fileoverview
 * Provides a collection of functions to work with CLI flags.
 */

import process from "node:process";

import log from "./log.js";

function isFlag(arg) {
  return arg.startsWith("--");
}

function checkFlags(supportedFlags, providedArgs) {
  for (const arg of providedArgs) {
    if (!isFlag(arg)) {
      continue;
    }

    if (!supportedFlags.includes(arg)) {
      log.println(`Error: Unsupported flag '${arg}'`);
      process.exit(1);
    }
  }

  return true;
}

export {
  checkFlags,
};
