/**
 * @fileoverview
 * Provides a collection of functions to work with CLI flags.
 */

function isFlag(arg) {
  return arg.startsWith("--");
}

function checkFlags(supportedFlags, providedArgs) {
  for (const arg of providedArgs) {
    if (!isFlag(arg)) {
      continue;
    }

    if (!supportedFlags.includes(arg)) {
      throw new Error(`Unsupported flag '${arg}'`);
    }
  }

  return true;
}

export {
  checkFlags,
};
