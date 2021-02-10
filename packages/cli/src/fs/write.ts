import type { WebManglerCliFile } from "./types";

import * as fs from "fs";

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
