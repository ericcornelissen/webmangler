#!/usr/bin/env node
/**
 * @fileoverview
 * Restore the repository to a clean state, removing all generated files.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import process from "node:process";

import execSync from "./utilities/exec.js";
import { checkFlags } from "./utilities/flags.js";
import log from "./utilities/log.js";
import * as paths from "./utilities/paths.js";
import values from "../.values.cjs";

const {
  reportsDir,
  tempDir,
  testDataDir,
} = values;

const FLAGS = {
  HARD: "--hard",
};

const ALWAYS_DELETE = [
  `${tempDir}/`,
  "npm-debug.log",
  "stryker.log",
];

const HARD_DELETE_ONLY = [
  `${reportsDir}/`,
  ".eslintcache",
];

main(process.argv.slice(2));

function main(argv) {
  checkFlags(Object.values(FLAGS), argv);

  log.print("Cleaning repository...");
  removeFilesAndFolders(argv);
  resetTestData();
  cleanPackages(argv);
  log.reprintln("Repository cleaned.");
}

function removeFilesAndFolders(argv) {
  log.reprint("Removing generated files & folders...");

  const filesAndFoldersToRemove = ALWAYS_DELETE;
  if (argv.includes(FLAGS.HARD)) {
    filesAndFoldersToRemove.push(...HARD_DELETE_ONLY);
  }

  for (const fileOrFolder of filesAndFoldersToRemove) {
    const fullPath = path.resolve(paths.projectRoot, fileOrFolder);
    fs.rmSync(fullPath, { force: true, recursive: true });
  }
}

function resetTestData() {
  log.reprint("Resetting testdata...");
  execSync("git", ["checkout", "HEAD", "--", `./${testDataDir}`]);
}

function cleanPackages(argv) {
  if (!argv.includes(FLAGS.HARD)) {
    return;
  }

  log.reprint("Cleaning packages...");
  for (const packageName of paths.listPackages()) {
    log.reprint(`Cleaning packages/${packageName}...`);
    execSync("npm", ["run", "clean"], {
      cwd: path.resolve(paths.packagesDir, packageName),
    });
  }
}
