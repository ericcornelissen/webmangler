"use strict";

const values = require("./.values.cjs");

const {
  packagesDir,
  packagesExpr,
  packagesList,
  reportsDir,
  srcDir,
  tempDir,
  testDirs,
} = values;

module.exports = {
  coverageAnalysis: "perTest",
  inPlace: false,
  mutate: [
    `${packagesDir}/${packagesExpr}/${srcDir}/**/*.ts`,
    `!**/${testDirs}/**/*.ts`,
  ],
  commandRunner: {
    command: `npm run test -- ${packagesList.join(" ")} --unit`,
  },

  timeoutMS: 25000,
  timeoutFactor: 2.5,

  disableTypeChecks: `${packagesDir}/${packagesExpr}/${srcDir}/**/*.ts`,
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",

  reporters: [
    "clear-text",
    "html",
    "progress",
  ],
  htmlReporter: {
    baseDir: `${reportsDir}/mutation`,
  },
  thresholds: {
    high: 80,
    low: 70,
    break: 50,
  },

  tempDirName: `${tempDir}/stryker`,
  cleanTempDir: false,
};
