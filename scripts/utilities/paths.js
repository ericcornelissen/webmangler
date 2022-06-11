/**
 * @fileoverview
 * Provides common paths for scripts.
 */

import * as path from "node:path";
import { fileURLToPath } from "node:url";

import values from "../../.values.cjs";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

const projectRoot = path.resolve(currentDirPath, "..", "..");
const nodeModules = path.resolve(projectRoot, "node_modules");
const nodeBin = path.resolve(nodeModules, ".bin");
const packagesDir = path.resolve(projectRoot, "packages");

const listPackages = values.getAllPackagesAsArray;

export {
  projectRoot,
  nodeModules,
  nodeBin,
  packagesDir,
  listPackages,
};
