import type { Filters, WebManglerCliFile } from "./types";

import File from "./file.class";

/**
 * An object to read files from disk.
 */
interface FileSystem {
  /**
   * Write a file from disk.
   *
   * @param path The path to the file.
   * @returns A promise resolving to a {@link Buffer} of the file contents.
   */
  readFile(path: string): Promise<Buffer>;
}

/**
 * Create a function to read a file from disk.
 *
 * @param fs A {@link FileSystem}.
 * @returns A function to read a file from disk.
 */
function createReadFile(fs: FileSystem) {
  return async function(filePath: string): Promise<WebManglerCliFile> {
    const fileBuffer = await fs.readFile(filePath);
    return new File({
      content: fileBuffer.toString(),
      filePath: filePath,
    });
  };
}

/**
 * Create a function to read a collection of files from disk.
 *
 * @param readFile A function to read a file.
 * @param listFilesFiltered A function to iterate over files, filtered.
 * @returns A function read a collection of files from disk.
 */
function createReadFilesFiltered(
  readFile: ReturnType<typeof createReadFile>,
  listFilesFiltered: (
    paths: Iterable<string>,
    filters: Filters
  ) => AsyncIterable<string>,
) {
  return async function(
    basePaths: string[],
    filters: Filters,
  ): Promise<WebManglerCliFile[]> {
    const filePromises: Promise<WebManglerCliFile>[] = [];
    for await (const filePath of listFilesFiltered(basePaths, filters)) {
      const filePromise = readFile(filePath);
      filePromises.push(filePromise);
    }

    const files = await Promise.all(filePromises);
    return files;
  };
}

export {
  createReadFile,
  createReadFilesFiltered,
};
