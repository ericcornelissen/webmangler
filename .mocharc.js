"use strict";

const {
  TEST_TYPE_BENCHMARK,
  TEST_TYPE_TEST,
} = require("./scripts/constants");

let packagesExpr = "*";
let packagesList = [packagesExpr];
if (process.env.TEST_PACKAGES !== undefined) {
  packagesExpr = process.env.TEST_PACKAGES;
  packagesList = process.env.TEST_PACKAGES.split(",");
  if (packagesList.length > 1) {
    packagesExpr = `{${packagesExpr}}`;
  }
}

let specSuffix;
switch (process.env.TEST_TYPE) {
  case TEST_TYPE_BENCHMARK:
    specSuffix = "bench";
    break;
  case TEST_TYPE_TEST:
  default:
    specSuffix = "test";
}

module.exports = {
  recursive: true,
  reporter: "dot",
  timeout: 5000,
  ui: "tdd",
  spec: `packages/${packagesExpr}/**/__tests__/*.${specSuffix}.ts`,
  require: [
    "ts-node/register",
    "tsconfig-paths/register",
  ],

  "watch-files": [
    ...packagesList.map((packageName) => `packages/${packageName}/**/*.ts`),
  ],
  "watch-ignore": [
    "node_modules/",
  ],
};
