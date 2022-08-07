#!/usr/bin/env node
/**
 * @fileoverview
 * Generate a `filters` YAML string for dorny/paths-filter for the various
 * conditional jobs (first argument). The filters are based on what files are
 * present in each package - e.g. a package without performance tests isn't
 * included in the output for "performance".
 */

import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";

import micromatch from "micromatch";

import log from "../utilities/log.js";
import * as paths from "../utilities/paths.js";
import values from "../../.values.cjs";

const {
  testsDir,
  testDirAll,
  testDirEndToEnd,
  testDirPerformance,
  testDirUnit,
} = values;

main(process.argv);

function main(argv) {
  const filterFor = argv[2];
  const isMain = argv[3] === "refs/heads/main";

  const packageCriteria = getPackageCriteria(filterFor);
  const filters = getPackageFilters(packageCriteria, isMain);
  log.print(filters);
}

function getPackageCriteria(arg) {
  switch (arg) {
  case "e2e":
    return (packageName) => hasFiles(
      packageName,
      (filePath) => micromatch.isMatch(
        filePath,
        `**/${testsDir}/${testDirEndToEnd}/**`,
      ),
    );
  case "mutation":
    return (packageName) => hasFiles(
      packageName,
      (filePath) => micromatch.isMatch(
        filePath,
        `**/${testsDir}/${testDirUnit}/**`,
      ),
    );
  case "performance":
    return (packageName) => hasFiles(
      packageName,
      (filePath) => micromatch.isMatch(
        filePath,
        `**/${testsDir}/${testDirPerformance}/**`,
      ),
    );
  case "test":
    return (packageName) => hasFiles(
      packageName,
      (filePath) => micromatch.isMatch(
        filePath,
        `**/${testsDir}/${testDirAll}/**`,
      ),
    );
  default:
    return () => true;
  }
}

function getPackageFilters(packageCriteria, isMain) {
  const filters = paths.listPackages()
    .filter(packageCriteria)
    .map(isMain ? asEverythingFilter : asPackageFilter)
    .join("\n");
  return filters;
}

function asEverythingFilter(packageName) {
  return `${packageName}: "**"`;
}

function asPackageFilter(packageName) {
  return [
    `${packageName}:`,
    "  - .github/workflows/code-checks.yml",
    `  - packages/${packageName}/**`,
    "  - package-lock.json",
  ].join("\n");
}

function hasFiles(pkg, test) {
  const helper = (folder) => {
    for (const entry of fs.readdirSync(folder)) {
      const entryPath = path.resolve(folder, entry);
      const stats = fs.statSync(entryPath);
      if (!stats.isFile()) {
        const result = helper(entryPath);
        if (result) return result;
      } else {
        const result = test(entryPath);
        if (result) return result;
      }
    }
    return false;
  };

  const packageRoot = path.resolve(paths.packagesDir, pkg, "src");
  return helper(packageRoot);
}
