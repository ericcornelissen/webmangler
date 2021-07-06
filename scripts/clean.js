#!/usr/bin/env node
/**
 * @fileoverview
 * Restore the repository to a clean state, removing all generated files.
 */

import * as path from "path";

import execSync from "./utilities/exec.js";
import log from "./utilities/log.js";
import * as paths from "./paths.js";

const HARD_FLAG = "--hard";

const ALWAYS_DELETE = [
  "_reports/",
  "npm-debug.log",
];

const HARD_DELETE_ONLY = [
  ".temp/",
  ".eslintcache",
];

main(process.argv);

function main(argv) {
  argv = argv.slice(2);

  removeFilesAndFolders(argv);
  resetTestData(argv);
  cleanPackages(argv);
}

function removeFilesAndFolders(argv) {
  log.print("Removing generated files & folders...");

  const filesAndFoldersToRemove = ALWAYS_DELETE;
  if (argv.includes(HARD_FLAG)) {
    filesAndFoldersToRemove.push(...HARD_DELETE_ONLY);
  }

  execSync("rm", [
    "-rf",
    ...filesAndFoldersToRemove.map(paths.resolve.fromRoot),
  ]);

  log.reprintln("Removed generated files & folders.");
}

function resetTestData() {
  log.print("Cleaning testdata...");
  execSync("git", ["checkout", "HEAD", "--", "./testdata"]);
  log.reprintln("Cleaned testdata.");
}

function cleanPackages(argv) {
  if (!argv.includes(HARD_FLAG)) {
    return;
  }

  log.println("Cleaning packages...");
  for (const packageName of paths.getPackages()) {
    log.print(`  Cleaning packages/${packageName}...`);
    execSync("npm", ["run", "clean"], {
      cwd: path.resolve(paths.packagesDir, packageName),
    });
    log.reprintln(`  Cleaned packages/${packageName}.`);
  }

  log.newline();
}
