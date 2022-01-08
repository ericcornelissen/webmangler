import type { WebManglerCliFile } from "./types";

/**
 * An object to write files to disk.
 */
interface FileSystem {
  /**
   * Write a file to disk.
   *
   * @param path The path to the file.
   * @param content The content to write to the file.
   * @returns A promise resolving on success.
   */
  writeFile(path: string, content: string): Promise<void>;
}

/**
 * Create a function to write a collection of files to disk.
 *
 * @param fs A {@link FileSystem}.
 * @returns A function to write to a collection of files to disk.
 */
function createWriteFiles(fs: FileSystem) {
  return async function(files: Iterable<WebManglerCliFile>): Promise<void> {
    const promises: Promise<void>[] = [];
    for (const file of files) {
      const writePromise = fs.writeFile(file.path, file.content);
      promises.push(writePromise);
    }

    await Promise.all(promises);
  };
}

export {
  createWriteFiles,
};
