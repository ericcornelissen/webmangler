/**
 * @fileoverview
 * Provides common paths for scripts.
 */

import * as path from "path";
import { fileURLToPath } from "url";

import values from "../.values.cjs";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

export const projectRoot = path.resolve(currentDirPath, "..");
export const nodeModules = path.resolve(projectRoot, "node_modules");
export const nodeBin = path.resolve(nodeModules, ".bin");
export const packagesDir = path.resolve(projectRoot, "packages");

export const listPackages = values.getAllPackagesAsArray;
