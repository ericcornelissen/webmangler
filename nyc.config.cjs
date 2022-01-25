"use strict";

const values = require("./.values.cjs");

const {
  dependenciesDir,
  compiledDir,
  packagesCoverageExclusions,
  packagesDir,
  packagesExpr,
  reportsDir,
  tempDir,
  testSuffixPerformance,
  testSuffixTest,
  testsDir,
} = values;

module.exports = {
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
    `${packagesDir}/**/*.{${testSuffixPerformance},${testSuffixTest}}.ts`,
    `${packagesDir}/**/${testsDir}/common/index.ts`,
    `${packagesDir}/**/${compiledDir}/`,
    ...packagesCoverageExclusions,
  ],

  reportDir: `./${reportsDir}/coverage`,
  tempDir: `./${tempDir}/nyc`,
};
