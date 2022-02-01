#!/usr/bin/env node
/**
 * @fileoverview
 * Run tests in the repository. Allows for configuring the type of tests to run
 * as well as which packages to run tests for.
 *
 * By default only VCS changed packages are tested, use the `--all` flag to test
 * all packages.
 */

import fs from "fs";
import * as path from "path";

import execSync from "./utilities/exec.js";
import log from "./utilities/log.js";
import vcs from "./utilities/vcs.js";
import * as paths from "./paths.js";
import values from "../.values.cjs";

const FLAGS = {
  ALL: "--all",
  COVERAGE: "--coverage",
  INTEGRATION: "--integration",
  MUTATION: "--mutation",
  PERFORMANCE: "--performance",
  UNIT: "--unit",
  WATCH: "--watch",
};


const nycBin = path.resolve(paths.nodeBin, "nyc");
const mochaBin = path.resolve(paths.nodeBin, "mocha");
const strykerBin = path.resolve(paths.nodeBin, "stryker");

main(process.argv, process.env);

async function main(argv, env) {
  argv = argv.slice(2);

  const cmd = getCliCommand(argv);
  const cmdArgs = getCommandArgs(argv);
  const packages = await getPackagesToRun(argv, env);
  const testType = getTestType(argv);

  if (packages.length === 0) {
    log.println("No changes to test (specify a package name or use `--all`).");
    return;
  }

  if (argv.includes(FLAGS.MUTATION)) {
    const allPackages = paths.listPackages().join(",");
    compilePackages(allPackages);
  } else {
    compilePackages(packages);
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

  const packagesList = packagesStr.split(",");
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
  if (argv.includes(FLAGS.COVERAGE)) {
    return nycBin;
  }

  if (argv.includes(FLAGS.MUTATION)) {
    return strykerBin;
  }

  return mochaBin;
}

function getCommandArgs(argv) {
  const cliArgs = [];
  if (argv.includes(FLAGS.COVERAGE)) {
    cliArgs.push(mochaBin);
  }

  if (argv.includes(FLAGS.MUTATION)) {
    cliArgs.push("run", "stryker.config.cjs");
  }

  if (argv.includes(FLAGS.WATCH)) {
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

  if (argv.includes(FLAGS.ALL)) {
    const allPackages = paths.listPackages();
    return allPackages.join(",");
  }

  if (packagesArgs.length === 0) {
    const changedPackages = await vcs.getChangedPackages();
    return changedPackages.join(",");
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

function getTestType(argv) {
  for (const arg of argv) {
    switch (arg) {
    case FLAGS.PERFORMANCE:
      return values.testTypePerformance;
    case FLAGS.INTEGRATION:
      return values.testTypeIntegration;
    case FLAGS.UNIT:
      return values.testTypeUnit;
    }
  }

  return values.testTypeTests;
}
