import * as fs from "fs";
import * as path from "path";

import WebManglerCliFile from "./file";

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
      const file = new WebManglerCliFile({
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

/**
 * Write a list of files to disk.
 *
 * @param files The files to write.
 */
export function writeFiles(files: WebManglerCliFile[]): void {
  files.forEach((file) => {
    fs.writeFileSync(file.path, file.content);
  });
}

export type { WebManglerCliFile };
