import type { Filters, WebManglerCliFile } from "./types";

import * as fs from "fs";

import File from "./file.class";
import { listFilesFiltered } from "./list";

/**
 * Read a file from disk.
 *
 * @param filePath The path of the file to read.
 * @returns A {@link WebManglerCliFile} for the file at `filePath`.
 */
export async function readFile(filePath: string): Promise<WebManglerCliFile> {
  const fileBuffer = await fs.promises.readFile(filePath);
  return new File({
    content: fileBuffer.toString(),
    filePath: filePath,
  });
}

/**
 * Read files from disk, folders are read recursively.
 *
 * @param basePaths The path(s) to find files at or under.
 * @param filters The extensions to consider.
 * @returns A {@link WebManglerCliFile} for all files under `basePath`.
 */
export async function readFilesFiltered(
  basePaths: string[],
  filters: Filters,
  ): Promise<WebManglerCliFile[]> {
  const filePromises: Promise<WebManglerCliFile>[] = [];
  for (const filePath of listFilesFiltered(basePaths, filters)) {
    const filePromise = readFile(filePath);
    filePromises.push(filePromise);
  }

  const files = await Promise.all(filePromises);
  return files;
}
