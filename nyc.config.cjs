"use strict";

const values = require("./.values.cjs");

const {
  dependenciesDir,
  compiledDir,
  packagesDir,
  packagesExpr,
  packagesList,
  reportsDir,
  srcDir,
  tempDir,
  testSuffixPerformance,
  testSuffixTest,
} = values;

const packagesExclusions = [];
if (packagesList.includes("cli")) {
  packagesExclusions.push(`${packagesDir}/cli/${srcDir}/index.ts`);
  packagesExclusions.push(`${packagesDir}/cli/${srcDir}/main.ts`);
}

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
    `${packagesDir}/**/${compiledDir}/`,
    ...packagesExclusions,
  ],

  reportDir: `./${reportsDir}/coverage`,
  tempDir: `./${tempDir}/nyc`,
};
