#!/usr/bin/env node
/**
 * @fileoverview
 * Run tests in the repository. Allows for configuring the type of tests to run
 * as well as which packages to run tests for.
 */

import fs from "fs";
import gitChangedFiles from "git-changed-files";
import * as path from "path";

import mocharc from "../.mocharc.cjs";
import execSync from "./utilities/exec.js";
import log from "./utilities/log.js";
import * as paths from "./paths.js";

const BENCHMARK_FLAG = "--benchmark";
const COVERAGE_FLAG = "--coverage";
const INTEGRATION_FLAG = "--integration";
const MUTATION_FLAG = "--mutation";
const UNIT_FLAG = "--unit";
const WATCH_FLAG = "--watch";

const {
  TEST_TYPE_ALL,
  TEST_TYPE_BENCHMARK,
  TEST_TYPE_INTEGRATION,
  TEST_TYPE_UNIT,
} = mocharc._constants;

const nycBin = path.resolve(paths.nodeModules, ".bin", "nyc");
const mochaBin = path.resolve(paths.nodeModules, ".bin", "mocha");
const strykerBin = path.resolve(paths.nodeModules, ".bin", "stryker");

main(process.argv, process.env);

async function main(argv, env) {
  argv = argv.slice(2);

  const cmd = getCliCommand(argv);
  const cmdArgs = getCommandArgs(argv);
  const packages = await getPackagesToRun(argv, env);
  const testType = getTestType(argv);

  if (argv.includes(MUTATION_FLAG)) {
    compilePackages(undefined, argv);
  } else {
    compilePackages(packages, argv);
  }

  runTests(cmd, cmdArgs, packages, testType);
}

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
  log.print("Compiling packages...");

  let packagesList;
  if (packagesStr !== undefined) {
    packagesList = packagesStr.split(",");
  } else {
    packagesList = paths.getPackages();
  }

  packagesList.forEach((packageName, i) => {
    log.reprint(`[${i+1}/${packagesList.length}] `);
    log.print(`Compiling packages/${packageName}...`);
    execSync("npm", ["run", "compile"], {
      cwd: path.resolve(paths.packagesDir, packageName),
    });
  });

  log.reprintln(`Compiled ${packagesList.length} package(s).`);
}

function getCliCommand(argv) {
  if (argv.includes(COVERAGE_FLAG)) {
    return nycBin;
  }

  if (argv.includes(MUTATION_FLAG)) {
    return strykerBin;
  }

  return mochaBin;
}

function getCommandArgs(argv) {
  const cliArgs = [];
  if (argv.includes(COVERAGE_FLAG)) {
    cliArgs.push(mochaBin);
  }

  if (argv.includes(MUTATION_FLAG)) {
    cliArgs.push("run", "stryker.config.cjs");
  }

  if (argv.includes(WATCH_FLAG)) {
    cliArgs.push("--watch", "--reporter", "min");
  }

  return cliArgs;
}

async function getPackagesToRun(argv, env) {
  const packagesArgs = argv.filter((arg) => !arg.startsWith("-"));
  if (env.TEST_PACKAGES) {
    const envPackages = env.TEST_PACKAGES.split(",");
    packagesArgs.push(...envPackages);
  }

  if (packagesArgs.length === 0) {
    const changedPackages = await getVcsChangedPackages();
    return changedPackages.length > 0 ? changedPackages.join(",") : undefined;
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

async function getVcsChangedPackages() {
  const { committedFiles, unCommittedFiles } = await gitChangedFiles({
    baseBranch: "main",
    formats: ["*.ts"],
  });

  const changedFiles = committedFiles.concat(unCommittedFiles);
  const changedPackages = changedFiles
    .map((filePath) => filePath.split(path.sep)[1])
    .filter((pkg, index, arr) => arr.indexOf(pkg) === index);

  return changedPackages;
}

function getTestType(argv) {
  for (const arg of argv) {
    switch (arg) {
      case BENCHMARK_FLAG:
        return TEST_TYPE_BENCHMARK;
      case INTEGRATION_FLAG:
        return TEST_TYPE_INTEGRATION;
      case UNIT_FLAG:
        return TEST_TYPE_UNIT;
    }
  }

  return TEST_TYPE_ALL;
}
