"use strict";

const mocharc = require("./.mocharc.cjs");

const { compiled, packages, reports, src, temp } = mocharc._dirs;
const { packagesExpr, packagesList } = mocharc._values;

const packagesExclusions = [];
if (packagesList.includes("cli")) {
  packagesExclusions.push(`${packages}/cli/${src}/index.ts`);
  packagesExclusions.push(`${packages}/cli/${src}/main.ts`);
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
    `${packages}/${packagesExpr}/**/*.ts`,
  ],
  exclude: [
    `${reports}/`,
    `${temp}/`,
    "node_modules/",
    `${packages}/**/*.bench.ts`,
    `${packages}/**/*.test.ts`,
    `${packages}/**/${compiled}/`,
    ...packagesExclusions,
  ],

  reportDir: `./${reports}/coverage`,
  tempDir: `./${temp}/nyc`,
};
