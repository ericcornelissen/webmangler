"use strict";

const testSuffixPerformance = "{bench,test}";
const testSuffixTest = "test";

const testTypeTests = "tests";
const testTypePerformance = "performance";
const testTypeIntegration = "integration";
const testTypeUnit = "unit";

const compiledDir = "{build,lib}";
const dependenciesDir = "node_modules";
const githubDir = ".github";
const mocksDir = "__mocks__";
const packagesDir = "packages";
const scriptsDir = "scripts";
const srcDir = "src";
const reportsDir = "_reports";
const tempDir = ".temp";
const testDataDir = "testdata";
const testsDir = "__tests__";

let packagesExpr = "*";
let packagesList = [packagesExpr];
if (process.env.TEST_PACKAGES !== undefined) {
  packagesExpr = process.env.TEST_PACKAGES;
  packagesList = process.env.TEST_PACKAGES.split(",");
  if (packagesList.length > 1) {
    packagesExpr = `{${packagesExpr}}`;
  }
}

function getAllPackagesAsArray() {
  const fs = require("fs");
  const path = require("path");
  const absPackagesDir = path.resolve(__dirname, "packages");
  const packagesArray = fs.readdirSync(absPackagesDir); // eslint-disable-line security/detect-non-literal-fs-filename
  return packagesArray;
}

module.exports = {
  // Directories
  compiledDir,
  dependenciesDir,
  githubDir,
  mocksDir,
  packagesDir,
  reportsDir,
  scriptsDir,
  srcDir,
  tempDir,
  testDataDir,
  testDirs: `{${testsDir},${mocksDir}}`,
  testsDir,

  // Computed
  getAllPackagesAsArray,
  packagesExpr,
  packagesList,

  // Tests
  testSuffixPerformance,
  testSuffixTest,
  testTypePerformance,
  testTypeIntegration,
  testTypeTests,
  testTypeUnit,
};
