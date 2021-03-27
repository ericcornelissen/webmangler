"use strict";

let specPackage = ".";
if (process.env.TEST_PKG !== undefined) {
  specPackage = process.env.TEST_PKG;
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
  statements: specPackage === "cli" ? 75 : 90,
  lines: specPackage === "cli" ? 75 : 90,
  branches: specPackage === "cli" ? 80 : 90,
  functions: specPackage === "cli" ? 80 : 90,
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
    `packages/${specPackage}/**/*.ts`,
  ],
  exclude: [
    "_reports/",
    ".temp/",
    "node_modules/",
    "packages/**/*.bench.ts",
    "packages/**/*.test.ts",
    "packages/**/*.mock.ts",
  ],

  reportDir: "./_reports",
  tempDir: "./.temp/nyc",
};
