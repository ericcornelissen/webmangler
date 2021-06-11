"use strict";

let packagesExpr = "*";
let packagesList = [packagesExpr];
if(process.env.TEST_PACKAGES !== undefined) {
  packagesList = process.env.TEST_PACKAGES.split(",");
  packagesExpr = process.env.TEST_PACKAGES;

  if (packagesList.length > 1) {
    packagesExpr = `{${packagesExpr}}`;
  }
}

let specSuffix = "test";
if (process.env.TEST_TYPE === "benchmark") {
  specSuffix = "bench";
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
