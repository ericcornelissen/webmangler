"use strict";

let packagesExpr = "*";
if (process.env.TEST_PACKAGES !== undefined) {
  packagesExpr = process.env.TEST_PACKAGES;
  const packagesList = process.env.TEST_PACKAGES.split(",");
  if (packagesList.length > 1) {
    packagesExpr = `{${packagesExpr}}`;
  }
}

module.exports = {
  coverageAnalysis: "perTest",
  inPlace: false,
  mutate: [
    `packages/${packagesExpr}/src/**/*.ts`,
    "!**/{__mocks__,__tests__}/**/*.ts",
  ],

  disableTypeChecks: `packages/${packagesExpr}/src/**/*.ts`,
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",

  reporters: [
    "clear-text",
    "progress",
    "html",
  ],
  htmlReporter: {
    baseDir: "_reports/mutation",
  },
  thresholds: {
    high: 80,
    low: 70,
    break: 50,
  },

  tempDirName: ".temp",
  cleanTempDir: false,
};
