import type { WebManglerCliFile } from "./types";

import * as fs from "fs";
import * as path from "path";

import _WebManglerCliFile from "./file.class";

/**
 * Read a list of files from disk.
 *
 * @param filePaths The file paths of the files to read.
 * @returns The files read and converted into {@link ManglerFile}.
 */
export function readFiles(filePaths: string[]): WebManglerCliFile[] {
  const files: WebManglerCliFile[] = [];
  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      // TODO `path not found ${filePath}`
      continue;
    }

    const lstat = fs.lstatSync(filePath);
    if (lstat.isFile()) {
      const file = new _WebManglerCliFile({
        content: fs.readFileSync(filePath).toString(),
        filePath: filePath,
      });

      files.push(file);
    } else {
      const subPaths = fs.readdirSync(filePath)
        .map((fileName) => path.resolve(filePath, fileName));
      const subFiles = readFiles(subPaths);
      files.push(...subFiles);
    }
  }

  return files;
}
