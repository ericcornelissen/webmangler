"use strict";

const { constants, dirs, values } = require("./.values.cjs");

const {
  TEST_TYPE_ALL,
  TEST_TYPE_BENCHMARK,
  TEST_TYPE_INTEGRATION,
  TEST_TYPE_UNIT,
} = constants;
const { packages, tests } = dirs;
const { packagesExpr, packagesList } = values;

const SPEC_SUFFIX_BENCHMARK = "bench";
const SPEC_SUFFIX_TEST = "test";

let specFolder;
let specSuffix;
switch (process.env.TEST_TYPE) {
  case TEST_TYPE_BENCHMARK:
    specFolder = "{.,benchmark}";
    specSuffix = SPEC_SUFFIX_BENCHMARK;
    break;
  case TEST_TYPE_INTEGRATION:
    specFolder = "integration";
    specSuffix = SPEC_SUFFIX_TEST;
    break;
  case TEST_TYPE_UNIT:
    specFolder = "{common,unit}";
    specSuffix = SPEC_SUFFIX_TEST;
    break;
  case TEST_TYPE_ALL:
  default:
    specFolder = "**";
    specSuffix = SPEC_SUFFIX_TEST;
}

module.exports = {
  recursive: true,
  reporter: "dot",
  timeout: 5000,
  ui: "tdd",
  spec: `${packages}/${packagesExpr}/**/${tests}/${specFolder}/*.${specSuffix}.ts`,
  require: [
    "ts-node/register",
    "tsconfig-paths/register",
  ],

  "watch-files": [
    ...packagesList.map((packageName) => `${packages}/${packageName}/**/*.ts`),
  ],
  "watch-ignore": [
    "node_modules/",
  ],
};
