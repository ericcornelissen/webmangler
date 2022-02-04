"use strict";

const values = require("./.values.cjs");

const {
  dependenciesDir,
  packagesDir,
  packagesExpr,
  packagesList,
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
  testTypeDir = "performance";
  break;
case testTypeIntegration:
  testTypeDir = "integration";
  break;
case testTypeUnit:
  testTypeDir = "{common,unit}";
  break;
case testTypeTests:
default:
  testTypeDir = "{.,common,integration,unit}";
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
