"use strict";

const values = require("./.values.cjs");

const {
  dependenciesDir,
  packagesDir,
  packagesExpr,
  packagesList,
  testDirAll,
  testDirIntegration,
  testDirPerformance,
  testDirUnit,
  testsDir,
  testSuffix,
  testTypePerformance,
  testTypeIntegration,
  testTypeTests,
  testTypeUnit,
} = values;

let testTypeDir;
switch (process.env.TEST_TYPE) {
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
