#!/usr/bin/env node
/**
 * @fileoverview
 * Cleans the repository from generated files.
 */

const { execFile } = require("child_process");
const path = require("path");

const fromRoot = (fileOrFolder) => path.resolve(__dirname, "..", fileOrFolder);

const TO_DELETE = [
  fromRoot(".temp/"),
  fromRoot("_reports/"),
  fromRoot("packages/core/lib/"),
  fromRoot(".eslintcache"),
  fromRoot("npm-debug.log"),
];

execFile("rm", ["-rf", ...TO_DELETE], (error) => {
  if (error) {
    console.error("Cleaning failed");
  } else {
    console.info("Repository cleaned");
  }
});
