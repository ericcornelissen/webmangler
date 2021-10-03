"use strict";

const TEST_TYPE_ALL = "all";
const TEST_TYPE_BENCHMARK = "benchmark";
const TEST_TYPE_INTEGRATION = "integration";
const TEST_TYPE_UNIT = "unit";

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
  constants: {
    TEST_TYPE_ALL,
    TEST_TYPE_BENCHMARK,
    TEST_TYPE_INTEGRATION,
    TEST_TYPE_UNIT,
  },
  dirs: {
    packages: "packages",
    compiled: "{build,lib}",
    src: "src",

    tests: "__tests__",
    mocks: "__mocks__",

    reports: "_reports",
    temp: ".temp",
  },
  values: {
    packagesExpr,
    packagesList,
  },
};
