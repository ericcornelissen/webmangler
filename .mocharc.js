"use strict";

let specPackage = ".";
if (process.env.TEST_PKG !== undefined) {
  specPackage = process.env.TEST_PKG;
}

let specSuffix = "test";
if (process.env.TEST_ENV === "benchmark") {
  specSuffix = "bench";
}

module.exports = {
  recursive: true,
  reporter: "dot",
  timeout: 5000,
  ui: "tdd",
  spec: `packages/${specPackage}/**/*.${specSuffix}.ts`,
  require: [
    "ts-node/register",
    "tsconfig-paths/register",
  ],

  "watch-files": [
    "packages/**/*.ts",
  ],
  "watch-ignore": [
    "node_modules/",
  ],
};
