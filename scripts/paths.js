/**
 * @fileoverview
 * Provides common paths for scripts.
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

export const projectRoot = path.resolve(currentDirPath, "..");
export const nodeModules = path.resolve(projectRoot, "node_modules");
export const packagesDir = path.resolve(projectRoot, "packages");

export function getPackages() {
  const packagesList = fs.readdirSync(packagesDir);
  return packagesList;
}

export const resolve = {
  _(...relativePath) {
    return path.resolve(...relativePath);
  },
  fromPackage(packageName, ...relativePath) {
    return path.resolve(packagesDir, packageName, ...relativePath);
  },
  fromRoot(...relativePath) {
    return path.resolve(projectRoot, ...relativePath);
  },
};
