import type { Filters } from "./types";

import * as fs from "fs";
import * as path from "path";

/**
 * Find out if a file has any of a set of extensions.
 *
 * If `extensions` is not provided this always returns `true`. If no extensions
 * are provided this always returns `false`.
 *
 * @param filePath The file path of interest.
 * @param [extensions] The extensions.
 * @returns `true` if `filepath` has one of the `extensions`, `false` otherwise.
 */
function hasSomeExtension(
  filePath: string,
  extensions?: Iterable<string>,
): boolean {
  if (extensions === undefined) {
    return true;
  }

  for (const extension of extensions) {
    if (filePath.endsWith(`.${extension}`)) {
      return true;
    }
  }

  return false;
}

/**
 * List the files at or under a path, folders *are* processed recursively.
 *
 * The provided path can be both a file or folder.
 *
 * @param basePath The path to find files at or under.
 * @yields The file(s) at or under `basePath`.
 * @throws if `basePath` does not exist.
 */
export function* listFiles(basePath: string): Iterable<string> {
  const exists = fs.existsSync(basePath);
  if (!exists) {
    throw new Error(`'${basePath}' does not exist`);
  }

  const lstat = fs.lstatSync(basePath);
  if (lstat.isFile()) {
    yield basePath;
  } else {
    for (const dirEntry of fs.readdirSync(basePath)) {
      const dirEntryPath =  path.resolve(basePath, dirEntry);
      yield* listFiles(dirEntryPath);
    }
  }
}

/**
 * List the files at or under a path, folders *are* processed recursively and
 * filter out files based on the specified {@link Filters}.
 *
 * The provided path can be both a file or folder.
 *
 * @param basePaths The path(s) to find files at or under.
 * @param filters The {@link Filters}.
 * @yields The file(s) at or under each basePath.
 */
export function* listFilesFiltered(
  basePaths: string[],
  filters: Filters,
): Iterable<string> {
  for (const basePath of basePaths) {
    for (const filePath of listFiles(basePath)) {
      const extensions = filters.extensions;
      if (!hasSomeExtension(filePath, extensions)) {
        continue;
      }

      yield filePath;
    }
  }
}
