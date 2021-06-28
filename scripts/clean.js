#!/usr/bin/env node
/**
 * @fileoverview
 * Restore the repository to a clean state, removing all generated files.
 */

import * as path from "path";

import execSync from "./utilities/exec.js";
import log from "./utilities/log.js";
import * as paths from "./paths.js";

const FILES_AND_FOLDERS_TO_REMOVE = [
  ".temp/",
  "_reports/",
  ".eslintcache",
  "npm-debug.log",
].map(paths.resolve.fromRoot);

resetTestData();
removeFilesAndFolders(FILES_AND_FOLDERS_TO_REMOVE);
cleanPackages();
log.println("Repository cleaned!");

function resetTestData() {
  execSync("git", ["checkout", "HEAD", "--", "./testdata"]);
}

function removeFilesAndFolders(filesAndFoldersToRemove) {
  execSync("rm", ["-rf", ...filesAndFoldersToRemove]);
}

function cleanPackages() {
  const packages = paths.getPackages();
  for (const packageName of packages) {
    const packagePath = path.resolve(paths.packagesDir, packageName);
    execSync("npm", ["run", "clean"], { cwd: packagePath });
  }
}
