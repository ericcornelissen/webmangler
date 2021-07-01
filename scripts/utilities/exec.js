/**
 * @fileoverview
 * Provides a way to execute other programs.
 */

import * as cp from "child_process";

export default function execSync(command, args, options) {
  try {
    cp.execFileSync(command, args, options);
  } catch (_) {
    process.exit(1);
  }
}
