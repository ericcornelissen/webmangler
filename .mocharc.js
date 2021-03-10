"use strict";

let specSuffix = "test";
if (process.env.TEST_ENV === "benchmark") {
  specSuffix = "bench";
}

module.exports = {
  recursive: true,
  reporter: "dot",
  timeout: 5000,
  ui: "tdd",
  spec: `packages/**/*.${specSuffix}.ts`,
  require: [
    "ts-node/register",
  ],

  "watch-files": [
    "packages/**/*.ts",
  ],
  "watch-ignore": [
    "node_modules/",
  ],
};
