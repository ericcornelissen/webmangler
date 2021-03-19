import type { WebManglerCliFile } from "./types";

import { promises as fs } from "fs";

/**
 * Write a list of files to disk.
 *
 * @param files The files to write.
 */
export async function writeFiles(files: WebManglerCliFile[]): Promise<void> {
  const promises: Promise<void>[] = [];
  for (const file of files) {
    const writePromise = fs.writeFile(file.path, file.content);
    promises.push(writePromise);
  }

  await Promise.all(promises);
}
