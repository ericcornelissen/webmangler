"use strict";

let specPackage = "";
if (process.env.TEST_PKG !== undefined) {
  specPackage = `${process.env.TEST_PKG}/`;
}

module.exports = {
  all: true,
  extends: [
    "@istanbuljs/nyc-config-typescript",
  ],
  reporter: [
    "lcov",
    "text",
  ],

  checkCoverage: true,
  statements: process.env.TEST_PKG === "cli" ? 75 : 90,
  lines: process.env.TEST_PKG === "cli" ? 75 : 90,
  branches: process.env.TEST_PKG === "cli" ? 80 : 90,
  functions: process.env.TEST_PKG === "cli" ? 80 : 90,
  watermarks: {
    statements: [85, 95],
    lines: [85, 95],
    branches: [85, 95],
    functions: [85, 95],
  },

  extensions: [
    ".ts",
  ],
  include: [
    `packages/${specPackage}**/*.ts`,
  ],
  exclude: [
    "_reports/",
    ".temp/",
    "node_modules/",
    "packages/**/*.bench.ts",
    "packages/**/*.test.ts",
  ],

  reportDir: "./_reports",
  tempDir: "./.temp/nyc",
};
