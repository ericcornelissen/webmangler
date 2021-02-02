import type { WebManglerOptions } from "webmangler";

import * as path from "path";
import * as fs from "fs";

import { DEFAULT_CONFIG } from "./default";
import loadJsConfig from "./load-js";

/**
 * Get a file path as absolute path.
 *
 * NOTE: This function can handle file paths that are already absolute.
 *
 * @param filePath The file path of interest.
 * @returns The absolute file path.
 */
function getAsAbsPath(filePath: string): string {
  if (path.isAbsolute(filePath)) {
    return filePath;
  } else {
    return path.resolve(filePath);
  }
}

/**
 * Get the type of file from a file path.
 *
 * @example
 * const fileType = getFileType("webmangler.config.js");
 * // fileType === "js"
 *
 *
 * @param filePath The file path of interest.
 * @returns The file type.
 */
function getFileType(filePath: string): string {
  const ext = path.extname(filePath);
  return ext.substring(1);
}

/**
 * Try to read a _WebMangler_ CLI configuration file.
 *
 * @param filePath The file path of the configuration file.
 * @returns The configuration or `null`.
 */
function readConfig(filePath: string): unknown | null {
  const absPath = getAsAbsPath(filePath);
  if (!fs.existsSync(absPath)) {
    return null;
  }

  const fileType = getFileType(filePath);
  switch (fileType) {
    case "js":
      return loadJsConfig(absPath);
    default:
      // TODO `unsupported configuration file type ${fileType}`
      return null;
  }
}

/**
 * @param configPath The config path. If defined, `fallbackPaths` is ignored.
 * @param fallbackPaths A list of paths to try in case `configPath` is .
 * @returns The configuration object or `null` if none was found.
 */
function _getConfiguration(
  configPath: string | undefined,
  fallbackPaths: string[],
): WebManglerOptions | null {
  if (configPath !== undefined) {
    return readConfig(configPath) as WebManglerOptions;
  }

  for (const fallbackPath of fallbackPaths) {
    const config = readConfig(fallbackPath);
    if (config !== null) {
      return config as WebManglerOptions;
    }
  }

  return null;
}

/**
 * Get the _WebMangler_ CLI configuration from a file.
 *
 * This function returns the configuration specified by the file at `configPath`
 * if defined. If no file is found, the default configuration is returned.
 *
 * If `configPath` is not defined, all `fallbackPaths` are checked and the first
 * configuration found is returned. If none of the `fallbackPaths` is found, the
 * default configuration is found.
 *
 * @param configPath The config path. If defined, `fallbackPaths` is ignored.
 * @param fallbackPaths A list of paths to try in case `configPath` is .
 * @returns The configuration object.
 */
export default function getConfiguration(
  configPath: string | undefined,
  fallbackPaths: string[],
): WebManglerOptions {
  const config = _getConfiguration(configPath, fallbackPaths);
  if (config === null) {
    return DEFAULT_CONFIG;
  }

  return config;
}


