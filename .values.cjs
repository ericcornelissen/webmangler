"use strict";

const testSuffix = "test";

const testTypeTests = "tests";
const testTypePerformance = "performance";
const testTypeIntegration = "integration";
const testTypeUnit = "unit";

const compiledDir = "{build,lib}";
const dependenciesDir = "node_modules";
const githubDir = ".github";
const packagesDir = "packages";
const scriptsDir = "scripts";
const srcDir = "src";
const reportsDir = "_reports";
const tempDir = ".temp";
const testDataDir = "testdata";
const testsDir = "__tests__";

const _testDirUnit = "unit";
const testDirCommon = "common";
const testDirIntegration = "integration";
const testDirPerformance = "performance";
const testDirAll = `{${[
  ".",
  testDirCommon,
  testDirIntegration,
  _testDirUnit,
].join(",")}}`;
const testDirUnit = `{${[
  testDirCommon,
  _testDirUnit,
].join(",")}}`;

let packagesExpr = "*";
let packagesList = [packagesExpr];
if (process.env.TEST_PACKAGES !== undefined) {
  packagesExpr = process.env.TEST_PACKAGES;
  packagesList = process.env.TEST_PACKAGES.split(",");
  if (packagesList.length > 1) {
    packagesExpr = `{${packagesExpr}}`;
  }
}

const packagesCoverageExclusions = [];
if (packagesList.includes("cli")) {
  packagesCoverageExclusions.push(`${packagesDir}/cli/${srcDir}/index.ts`);
  packagesCoverageExclusions.push(`${packagesDir}/cli/${srcDir}/main.ts`);
}

function getAllPackagesAsArray() {
  const fs = require("fs");
  const path = require("path");
  const absPackagesDir = path.resolve(__dirname, "packages");
  const packagesArray = fs.readdirSync(absPackagesDir);
  return packagesArray;
}

module.exports = {
  // Directories
  compiledDir,
  dependenciesDir,
  githubDir,
  packagesDir,
  reportsDir,
  scriptsDir,
  srcDir,
  tempDir,
  testDataDir,
  testDirAll,
  testDirCommon,
  testDirIntegration,
  testDirPerformance,
  testDirUnit,
  testsDir,

  // Computed
  getAllPackagesAsArray,
  packagesCoverageExclusions,
  packagesExpr,
  packagesList,

  // Tests
  testSuffix,
  testTypePerformance,
  testTypeIntegration,
  testTypeTests,
  testTypeUnit,
};
