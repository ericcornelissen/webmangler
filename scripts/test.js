#!/usr/bin/env node
/**
 * @fileoverview
 * Run the tests for the repository allowing for configuring the test type as
 * well as which packages.
 */

"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BENCHMARK_FLAG = "--benchmark";
const COVERAGE_FLAG = "--coverage";
const WATCH_FLAG = "--watch";

const projectRoot = path.resolve(__dirname, "..");
const binDir = path.resolve(projectRoot, "node_modules", ".bin");
const nycBin = path.resolve(binDir, "nyc");
const mochaBin = path.resolve(binDir, "mocha");

const argv = process.argv.slice(2);

spawnSync(getSpawnCmd(argv), getSpawnArgs(argv), {
  env: Object.assign({ }, process.env, {
    TEST_PACKAGES: getPackagesToRun(argv),
    TEST_TYPE: getTestType(argv),
  }),
  stdio: ["inherit", "inherit", "inherit"],
});

/**
 * Get the arguments to run.
 *
 * @param args The arguments vector.
 * @returns The argument to run.
 */
function getSpawnCmd(args) {
  if (args.includes(COVERAGE_FLAG)) {
    return nycBin;
  }

  return mochaBin;
}

/**
 * Get the arguments for the command to run.
 *
 * @param args The arguments vector.
 * @returns An array of arguments.
 */
function getSpawnArgs(args) {
  const result = [];
  if (args.includes(COVERAGE_FLAG)) {
    result.push(mochaBin);
  }

  if (args.includes(WATCH_FLAG)) {
    result.push("--watch", "--reporter", "min");
  }

  return result;
}

/**
 * Get the packages for which to run tests.
 *
 * @param args The arguments vector.
 * @returns Either `undefined` or a glob of the packages to run tests for.
 */
function getPackagesToRun(args) {
  const packageArgs = args.filter((arg) => !arg.startsWith("-"));
  if (packageArgs.length === 0) {
    return;
  }

  const allPackagesExist = packageArgs.every((packageName) => {
    const packagePath = path.resolve(projectRoot, "packages", packageName);
    return fs.existsSync(packagePath);
  });

  const packagesExpr = packageArgs.join(",");
  if (!allPackagesExist) {
    throw new Error(`One of the packages doesn't exist: ${packagesExpr}`);
  }

  return packagesExpr;
}

/**
 * Get the type of tests to be run.
 *
 * @param args The arguments vector.
 * @returns One of `undefined` or `"benchmark"`.
 */
function getTestType(args) {
  for (const arg of args) {
    switch (arg) {
      case BENCHMARK_FLAG:
        return "benchmark";
    }
  }

  return;
}
