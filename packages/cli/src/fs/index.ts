import type { WebManglerCliFile } from "./types";

import { promises as fs } from "node:fs";
import * as path from "node:path";

import { createListFiles, createListFilesFiltered } from "./list";
import { createReadFile, createReadFilesFiltered } from "./read";
import { createWriteFiles } from "./write";

/**
 * List the files at or under a path, folders *are* processed recursively.
 *
 * The provided path can be both a file or folder.
 *
 * @param basePath The path to find files at or under.
 * @yields The file(s) at or under `basePath`.
 */
const listFiles = createListFiles(fs, path);

/**
 * List the files at or under a path, folders *are* processed recursively and
 * filter out files based on the specified {@link Filters}.
 *
 * The provided path can be both a file or folder.
 *
 * @param basePath The path to find files at or under.
 * @param filters The extensions to consider.
 * @yields The file(s) at or under `basePath`.
 * @throws if `basePath` does not exist.
 */
const listFilesFiltered = createListFilesFiltered(listFiles);

/**
 * Read a file from disk.
 *
 * @param filePath The path of the file to read.
 * @returns A {@link WebManglerCliFile} for the file at `filePath`.
 */
const readFile = createReadFile(fs);

/**
 * Read files from disk, folders are read recursively.
 *
 * @param basePaths The path(s) to find files at or under.
 * @param filters The extensions to consider.
 * @returns A {@link WebManglerCliFile} for all files under `basePath`.
 */
const readFilesFiltered = createReadFilesFiltered(
  readFile,
  listFilesFiltered,
);

/**
 * Write a collection of files to disk.
 *
 * @param files The files to write.
 */
const writeFiles = createWriteFiles(fs);

export {
  readFilesFiltered,
  writeFiles,
};

export type {
  WebManglerCliFile,
};
