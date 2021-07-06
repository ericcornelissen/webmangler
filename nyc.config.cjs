"use strict";

let packagesExpr = "*";
let packagesList = [packagesExpr];
if (process.env.TEST_PACKAGES !== undefined) {
  packagesExpr = process.env.TEST_PACKAGES;
  packagesList = process.env.TEST_PACKAGES.split(",");
  if (packagesList.length > 1) {
    packagesExpr = `{${packagesExpr}}`;
  }
}

const packagesExclusions = [];
if (packagesList.includes("cli")) {
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
    `packages/${packagesExpr}/**/*.ts`,
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

  reportDir: "./_reports/coverage",
  tempDir: "./.temp/nyc",
};
