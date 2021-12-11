#!/usr/bin/env node
/**
 * @fileoverview
 * Restore the repository to a clean state, removing all generated files.
 */

import * as path from "path";

import execSync from "./utilities/exec.js";
import log from "./utilities/log.js";
import * as paths from "./paths.js";
import values from "../.values.cjs";

const {
  reportsDir,
  tempDir,
  testDataDir,
} = values;

const HARD_FLAG = "--hard";

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
  log.print("Cleaning repository...");
  removeFilesAndFolders(argv);
  resetTestData();
  cleanPackages(argv);
  log.reprintln("Repository cleaned.");
}

function removeFilesAndFolders(argv) {
  log.reprint("Removing generated files & folders...");

  const filesAndFoldersToRemove = ALWAYS_DELETE;
  if (argv.includes(HARD_FLAG)) {
    filesAndFoldersToRemove.push(...HARD_DELETE_ONLY);
  }

  execSync("rm", [
    "-rf",
    ...filesAndFoldersToRemove.map(
      (fileOrFolder) => path.resolve(paths.projectRoot, fileOrFolder),
    ),
  ]);
}

function resetTestData() {
  log.reprint("Resetting testdata...");
  execSync("git", ["checkout", "HEAD", "--", `./${testDataDir}`]);
}

function cleanPackages(argv) {
  if (!argv.includes(HARD_FLAG)) {
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
