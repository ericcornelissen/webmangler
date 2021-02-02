#!/usr/bin/env node
/**
 * @fileoverview
 * Restore the repository to a clean state, removing all generated files.
 */

const { execFileSync } = require("child_process");
const path = require("path");

const fromRoot = (fileOrFolder) => path.resolve(__dirname, "..", fileOrFolder);

const FILES_AND_FOLDERS_TO_DELETE = [
  ".temp/",
  "_reports/",
  ".eslintcache",
  "npm-debug.log",
].map(fromRoot);

const PACKAGES_TO_CLEAN = [
  "packages/cli",
  "packages/core",
].map(fromRoot);

execFileSync("git", ["checkout", "HEAD", "--", "./testdata"]);
execFileSync("rm", ["-rf", ...FILES_AND_FOLDERS_TO_DELETE]);
PACKAGES_TO_CLEAN.forEach((packageDir) => {
  execFileSync("npm", ["run", "clean"], { cwd: packageDir });
});

console.info("Repository cleaned!");
