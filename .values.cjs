"use strict";

const testSuffixBenchmark = "bench";
const testSuffixTest = "test";

const testTypeTests = "tests";
const testTypeBenchmark = "benchmark";
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
  packagesExpr,
  packagesList,

  // Tests
  testSuffixBenchmark,
  testSuffixTest,
  testTypeBenchmark,
  testTypeIntegration,
  testTypeTests,
  testTypeUnit,
};
