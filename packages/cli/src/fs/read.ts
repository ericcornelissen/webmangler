import type { WebManglerCliFile } from "./types";

import * as fs from "fs";
import * as path from "path";

import _WebManglerCliFile from "./file.class";

/**
 * Get the files at or under a certain path. The path can be both a file or a
 * directory.
 *
 * @param basePath The path to find files at or under.
 * @yields The file(s) at or under basePath.
 */
function* getFilesIn(basePath: string): Iterable<string> {
  if (!fs.existsSync(basePath)) {
    return;
  }

  const lstat = fs.lstatSync(basePath);
  if (lstat.isFile()) {
    yield basePath;
  } else {
    for (const dirEntry of fs.readdirSync(basePath)) {
      const dirEntryPath = path.resolve(basePath, dirEntry);
      yield* getFilesIn(dirEntryPath);
    }
  }
}
/**
 * Get the files at or under a certain path, but filter out any files based on
 * the provided extension.
 *
 * The path can be both a file or a directory.
 *
 * @param basePath The path to find files at or under.
 * @param extensions The extensions of files to yield.
 * @yields The file(s) at or under basePath.
 */
function* getFilesInFiltered(
  basePath: string,
  extensions: string[],
): Iterable<string> {
  for (const filePath of getFilesIn(basePath)) {
    if (extensions.some((ext) => filePath.endsWith(`.${ext}`))) {
      yield filePath;
    }
  }
}

/**
 * Read all the files at or under a certain path.
 *
 * @param basePath The path to find files at or under.
 * @param extensions The extensions to consider.
 * @returns A {@link WebManglerCliFile} for all files under `basePath`.
 */
function readFilesIn(
  basePath: string,
  extensions: string[],
): WebManglerCliFile[] {
  const files: WebManglerCliFile[] = [];
  for (const filePath of getFilesInFiltered(basePath, extensions)) {
    const file = new _WebManglerCliFile({
      content: fs.readFileSync(filePath).toString(),
      filePath: filePath,
    });

    files.push(file);
  }

  return files;
}

/**
 * Read a list of directories or files from disk. Directories are recursively
 * read.
 *
 * @param basePaths The paths of the files to read.
 * @param extensions The extensions to read.
 * @returns The files read and converted into {@link ManglerFile}.
 */
export function readFilesInAll(
  basePaths: string[],
  extensions: string[],
): WebManglerCliFile[] {
  const files: WebManglerCliFile[] = [];
  for (const basePath of basePaths) {
    files.push(...readFilesIn(basePath, extensions));
  }

  return files;
}
