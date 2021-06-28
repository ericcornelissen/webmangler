#!/usr/bin/env node
/**
 * @fileoverview
 * Run tests in the repository. Allows for configuring the type of tests to run
 * as well as which packages to run tests for.
 */

import fs from "fs";
import * as path from "path";

import mocharc from "../.mocharc.cjs";
import execSync from "./utilities/exec.js";
import log from "./utilities/log.js";
import * as paths from "./paths.js";

const BENCHMARK_FLAG = "--benchmark";
const COVERAGE_FLAG = "--coverage";
const WATCH_FLAG = "--watch";

const {
  TEST_TYPE_BENCHMARK,
  TEST_TYPE_TEST,
} = mocharc._constants;

const nycBin = path.resolve(paths.nodeModules, ".bin", "nyc");
const mochaBin = path.resolve(paths.nodeModules, ".bin", "mocha");

const argv = process.argv.slice(2);

const cmd = getCliCommand(argv);
const cmdArgs = getCommandArgs(argv);
const packages = getPackagesToRun(argv);
const testType = getTestType(argv);

compilePackages(packages);
runTests(cmd, cmdArgs, packages, testType);

function runTests(spawnCmd, spawnArgs, TEST_PACKAGES, TEST_TYPE) {
  log.println("Running test...");
  execSync(spawnCmd, spawnArgs, {
    env: Object.assign({ }, process.env, {
      TEST_PACKAGES,
      TEST_TYPE,
    }),
    stdio: ["inherit", "inherit", "inherit"],
  });
}

function compilePackages(packagesStr) {
  log.println("Compiling packages...");

  let packagesList;
  if (packagesStr !== undefined) {
    packagesList = packagesStr.split(",");
  } else {
    packagesList = paths.getPackages();
  }

  for (const packageName of packagesList) {
    log.print(`  Compiling packages/${packageName}...`);
    execSync("npm", ["run", "compile"], {
      cwd: path.resolve(paths.packagesDir, packageName),
    });
    log.reprintln(`  Compiled packages/${packageName}.`);
  }

  log.newline();
}

function getCliCommand(args) {
  if (args.includes(COVERAGE_FLAG)) {
    return nycBin;
  }

  return mochaBin;
}

function getCommandArgs(args) {
  const cliArgs = [];
  if (args.includes(COVERAGE_FLAG)) {
    cliArgs.push(mochaBin);
  }

  if (args.includes(WATCH_FLAG)) {
    cliArgs.push("--watch", "--reporter", "min");
  }

  return cliArgs;
}

function getPackagesToRun(args) {
  const packagesArgs = args.filter((arg) => !arg.startsWith("-"));
  if (packagesArgs.length === 0) {
    return;
  }

  const allPackagesExist = packagesArgs.every((packageName) => {
    const packagePath = path.resolve(paths.packagesDir, packageName);
    return fs.existsSync(packagePath);
  });

  const packagesExpr = packagesArgs.join(",");
  if (!allPackagesExist) {
    throw new Error(`One of the packages doesn't exist: ${packagesExpr}`);
  }

  return packagesExpr;
}

function getTestType(args) {
  for (const arg of args) {
    switch (arg) {
      case BENCHMARK_FLAG:
        return TEST_TYPE_BENCHMARK;
    }
  }

  return TEST_TYPE_TEST;
}
