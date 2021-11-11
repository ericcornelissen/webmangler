"use strict";

const values = require("./.values.cjs");

const {
  dependenciesDir,
  packagesDir,
  packagesExpr,
  packagesList,
  testsDir,
  testSuffixBenchmark,
  testSuffixTest,
  testTypePerformance,
  testTypeIntegration,
  testTypeTests,
  testTypeUnit,
} = values;


let testTypeDir;
let testTypeSuffix;
switch (process.env.TEST_TYPE) {
  case testTypePerformance:
    testTypeDir = "{.,benchmark}";
    testTypeSuffix = testSuffixBenchmark;
    break;
  case testTypeIntegration:
    testTypeDir = "integration";
    testTypeSuffix = testSuffixTest;
    break;
  case testTypeUnit:
    testTypeDir = "{common,unit}";
    testTypeSuffix = testSuffixTest;
    break;
  case testTypeTests:
  default:
    testTypeDir = "**";
    testTypeSuffix = testSuffixTest;
}

module.exports = {
  recursive: true,
  reporter: "dot",
  timeout: 5000,
  ui: "tdd",
  spec: `${packagesDir}/${packagesExpr}/**/${testsDir}/${testTypeDir}/*.${testTypeSuffix}.ts`,
  require: [
    "ts-node/register",
    "tsconfig-paths/register",
  ],

  "watch-files": [
    ...packagesList.map((packageName) => `${packagesDir}/${packageName}/**/*.ts`),
  ],
  "watch-ignore": [
    `${dependenciesDir}/`,
  ],
};
