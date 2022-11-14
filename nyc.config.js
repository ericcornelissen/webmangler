// Check out nyc at: https://istanbul.js.org/

import process from "node:process";

import values from "./.values.cjs";

const {
  dependenciesDir,
  compiledDir,
  packagesCoverageExclusions,
  packagesDir,
  packagesExpr,
  packagesList,
  reportsDir,
  tempDir,
  testDirCommon,
  testsDir,
  testSuffix,
  testTypeEndToEnd,
  testTypeIntegration,
  testTypeUnit,
} = values;

const reportIdentifier = packagesList.length > 1 ? "_mixed" : packagesList[0];

let testTypeCoverageExclusions;
switch (process.env.TEST_TYPE) {
case testTypeEndToEnd:
  testTypeCoverageExclusions = [
    `${packagesDir}/**/__tests__/`,
  ];
  break;
case testTypeIntegration:
  testTypeCoverageExclusions = [
    `${packagesDir}/**/__tests__/`,
  ];
  break;
case testTypeUnit:
  testTypeCoverageExclusions = [
    `${packagesDir}/**/index.ts`,
  ];
  break;
default:
  testTypeCoverageExclusions = [];
}

export default {
  all: true,
  extends: [
    "@istanbuljs/nyc-config-typescript",
  ],
  reporter: [
    "lcov",
    "text",
  ],

  checkCoverage: true,
  statements: 90,
  lines: 90,
  branches: 90,
  functions: 90,
  watermarks: {
    statements: [85, 95],
    lines: [85, 95],
    branches: [85, 95],
    functions: [85, 95],
  },

  extensions: [
    ".ts",
  ],
  include: [
    `${packagesDir}/${packagesExpr}/**/*.ts`,
  ],
  exclude: [
    `${reportsDir}/`,
    `${tempDir}/`,
    `${dependenciesDir}/`,
    `${packagesDir}/**/*.${testSuffix}.ts`,
    `${packagesDir}/**/${testsDir}/${testDirCommon}/index.ts`,
    `${packagesDir}/**/${compiledDir}/`,
    ...packagesCoverageExclusions,
    ...testTypeCoverageExclusions,
  ],

  reportDir: [
    ".",
    reportsDir,
    "coverage",
    process.env.TEST_TYPE,
    reportIdentifier,
  ].join("/"),
  tempDir: `./${tempDir}/nyc/${reportIdentifier}`,
};
