#!/usr/bin/env node
/**
 * @fileoverview
 * Restore the repository to a clean state, removing all generated files.
 */

import { execFileSync } from "child_process";

import * as paths from "./paths.js";

const FILES_AND_FOLDERS_TO_DELETE = [
  ".temp/",
  "_reports/",
  ".eslintcache",
  "npm-debug.log",
].map(paths.resolve.fromRoot);

const PACKAGES_TO_CLEAN = [
  "packages/benchmarking",
  "packages/cli",
  "packages/core",
  "packages/testing",
].map(paths.resolve.fromRoot);

execFileSync("git", ["checkout", "HEAD", "--", "./testdata"]);
execFileSync("rm", ["-rf", ...FILES_AND_FOLDERS_TO_DELETE]);
PACKAGES_TO_CLEAN.forEach((packageDir) => {
  execFileSync("npm", ["run", "clean"], { cwd: packageDir });
});

console.info("Repository cleaned!");
