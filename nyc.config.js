"use strict";

let specPackage = "";
if (process.env.TEST_PKG !== undefined) {
  specPackage = `${process.env.TEST_PKG}/`;
}

const packagesExclusions = [];
if (process.env.TEST_PKG === "cli") {
  packagesExclusions.push("packages/cli/src/index.ts");
  packagesExclusions.push("packages/cli/src/main.ts");
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
  statements: 90,
  lines: 90,
  branches: 90,
  functions: 90,
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
    "packages/**/build/",
    ...packagesExclusions,
  ],

  reportDir: "./_reports",
  tempDir: "./.temp/nyc",
};
