#!/usr/bin/env node
/**
 * @fileoverview
 * Generate a `filters` YAML string for dorny/paths-filter for the various
 * conditional jobs (first argument). The filters are based on what files are
 * present in each package - e.g. a package without benchmarks isn't included
 * in the output for "benchmark".
 */

import * as fs from "fs";

import log from "../utilities/log.js";
import * as paths from "../paths.js";

main(process.argv);

function main(argv) {
  const packageCriteria = getPackageCriteria(argv[2]);
  const filters = getPackageFilters(packageCriteria);
  log.print(filters);
}

function getPackageCriteria(arg) {
  switch (arg) {
  case "benchmark":
    return (pkg) => hasFiles(pkg, /\.bench\.ts$/);
  case "test":
    return (pkg) => hasFiles(pkg, /\.test\.ts$/);
  default:
    return () => true;
  }
}

function getPackageFilters(packageCriteria) {
  const filters = paths.getPackages()
    .filter(packageCriteria)
    .map(asPackageFilter)
    .join("\n");
  return filters;
}

function asPackageFilter(packageName) {
  return [
    `${packageName}:`,
    "  - .github/workflows/push-checks.yml",
    `  - packages/${packageName}/**`,
    "  - package-lock.json",
  ].join("\n");
}

function hasFiles(pkg, fileRegExp) {
  const helper = (folder) => {
    for (const entry of fs.readdirSync(folder)) {
      const entryPath = paths.resolve._(folder, entry);
      const stats = fs.statSync(entryPath);
      if (!stats.isFile()) {
        const result = helper(entryPath);
        if (result) return result;
      } else {
        const result = fileRegExp.test(entryPath);
        if (result) return result;
      }
    }
    return false;
  };

  const packageRoot = paths.resolve.fromPackage(pkg, "src");
  return helper(packageRoot);
}
