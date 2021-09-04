"use strict";

const TEST_TYPE_BENCHMARK = "benchmark";
const TEST_TYPE_INTEGRATION = "integration";
const TEST_TYPE_TEST = "test";
const TEST_TYPE_UNIT = "unit";

const SPEC_SUFFIX_BENCHMARK = "bench";
const SPEC_SUFFIX_INTEGRATION = "intg";
const SPEC_SUFFIX_TEST = "test";
const SPEC_SUFFIX_UNIT = "unit";

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
    specSuffix = SPEC_SUFFIX_BENCHMARK;
    break;
  case TEST_TYPE_INTEGRATION:
    specSuffix = SPEC_SUFFIX_INTEGRATION;
    break;
  case TEST_TYPE_UNIT:
    specSuffix = SPEC_SUFFIX_UNIT;
    break;
  case TEST_TYPE_TEST:
  default:
    specSuffix = `{${SPEC_SUFFIX_INTEGRATION},${SPEC_SUFFIX_TEST},${SPEC_SUFFIX_UNIT}}`;
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

  _constants: {
    TEST_TYPE_BENCHMARK,
    TEST_TYPE_INTEGRATION,
    TEST_TYPE_TEST,
    TEST_TYPE_UNIT,
  },
};
