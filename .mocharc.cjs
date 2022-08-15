"use strict";

const process = require("node:process");

const values = require("./.values.cjs");

const {
  dependenciesDir,
  packagesDir,
  packagesExpr,
  packagesList,
  testDirAll,
  testDirEndToEnd,
  testDirIntegration,
  testDirPerformance,
  testDirUnit,
  testsDir,
  testSuffix,
  testTypeEndToEnd,
  testTypePerformance,
  testTypeIntegration,
  testTypeTests,
  testTypeUnit,
} = values;

let testTypeDir;
switch (process.env.TEST_TYPE) {
case testTypeEndToEnd:
  testTypeDir = testDirEndToEnd;
  break;
case testTypePerformance:
  testTypeDir = testDirPerformance;
  break;
case testTypeIntegration:
  testTypeDir = testDirIntegration;
  break;
case testTypeUnit:
  testTypeDir = testDirUnit;
  break;
case testTypeTests:
default:
  testTypeDir = testDirAll;
}

module.exports = {
  recursive: true,
  reporter: "dot",
  timeout: 5000,
  ui: "tdd",
  spec: [
    packagesDir,
    packagesExpr,
    "**",
    testsDir,
    testTypeDir,
    `*.${testSuffix}.ts`,
  ].join("/"),
  require: [
    "ts-node/register",
    "tsconfig-paths/register",
  ],

  "watch-files": [
    ...packagesList.map((packageName) => {
      return `${packagesDir}/${packageName}/**/*.ts`;
    }),
  ],
  "watch-ignore": [
    `${dependenciesDir}/`,
  ],
};
