"use strict";

const TEST_TYPE_ALL = "all";
const TEST_TYPE_BENCHMARK = "benchmark";
const TEST_TYPE_INTEGRATION = "integration";
const TEST_TYPE_UNIT = "unit";

const SPEC_SUFFIX_BENCHMARK = "bench";
const SPEC_SUFFIX_TEST = "test";

const DIR_COMPILED = "{build,lib}";
const DIR_MOCKS = "__mocks__";
const DIR_PACKAGES = "packages";
const DIR_REPORTS = "_reports";
const DIR_SRC = "src";
const DIR_TEMP = ".temp";
const DIR_TESTS = "__tests__";

const packages = DIR_PACKAGES;
const tests = DIR_TESTS;

let packagesExpr = "*";
let packagesList = [packagesExpr];
if (process.env.TEST_PACKAGES !== undefined) {
  packagesExpr = process.env.TEST_PACKAGES;
  packagesList = process.env.TEST_PACKAGES.split(",");
  if (packagesList.length > 1) {
    packagesExpr = `{${packagesExpr}}`;
  }
}

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

  _constants: {
    TEST_TYPE_ALL,
    TEST_TYPE_BENCHMARK,
    TEST_TYPE_INTEGRATION,
    TEST_TYPE_UNIT,
  },
  _dirs: {
    compiled: DIR_COMPILED,
    mocks: DIR_MOCKS,
    packages: DIR_PACKAGES,
    reports: DIR_REPORTS,
    src: DIR_SRC,
    temp: DIR_TEMP,
    tests: DIR_TESTS,
  },
  _values: {
    packagesExpr,
    packagesList,
  },
};
