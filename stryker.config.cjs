"use strict";

const mocharc = require("./.mocharc.cjs");

const { packagesExpr, packagesList } = mocharc._values;

module.exports = {
  coverageAnalysis: "perTest",
  inPlace: false,
  mutate: [
    `packages/${packagesExpr}/src/**/*.ts`,
    "!**/{__mocks__,__tests__}/**/*.ts",
  ],
  commandRunner: {
    command: `npm run test -- ${packagesList.join(" ")}`,
  },

  timeoutMS: 25000,
  timeoutFactor: 2.5,

  disableTypeChecks: `packages/${packagesExpr}/src/**/*.ts`,
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",

  reporters: [
    "clear-text",
    "html",
    "progress",
  ],
  htmlReporter: {
    baseDir: "_reports/mutation",
  },
  thresholds: {
    high: 80,
    low: 70,
    break: 50,
  },

  tempDirName: ".temp/stryker",
  cleanTempDir: false,
};
