import type { Filters } from "./types";

/**
 * An object representing stats about a file or folder.
 */
interface Stats {
  /**
   * Check if this is a file or not.
   *
   * @returns `true` if it is a file, `false` otherwise.
   */
  isFile(): boolean;
}

/**
 * An object to get information about files and folders.
 */
interface FileSystem {
  /**
   * Check if a file or folder exists/is accessible.
   *
   * @param fileOrFolderPath The path of the file or folder.
   * @returns Nothing if the file or folder is accessible.
   * @throws If the file or folder is not accessible.
   */
  access(fileOrFolderPath: string): Promise<void>;

  /**
   * Get {@link Stats} for a file or folder.
   *
   * @param fileOrFolderPath The path of the file or folder.
   * @returns The {@link Stats} of the file or folder at `fileOrFolderPath`.
   */
  lstat(fileOrFolderPath: string): Promise<Stats>;

  /**
   * Get the contents of a folder.
   *
   * @param folderPath The path of the folder.
   * @returns A {@link Promise} resolving to a list of files and folders.
   */
  readdir(folderPath: string): Promise<Iterable<string>>;
}

/**
 * An object to operate on file system paths.
 */
interface Path {
  /**
   * Resolve a path to a full path.
   *
   * @param basePath The base path.
   * @param subPath A sub path.
   * @returns The full path.
   */
  resolve(basePath: string, subPath: string): string;
}

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
 * Create a function to list the files at or under a path, folders *are*
 * processed recursively.
 *
 * @param fs A {@link FileSystem}.
 * @param path A {@link Path}.
 * @returns A function to list files at or under a specific path.
 */
function createListFiles(fs: FileSystem, path: Path) {
  /**
   * List the files at or under a path, folders *are* processed recursively.
   *
   * @param basePath The path to list files for.
   * @yields Files at or under the `basePath`.
   */
  async function* listFiles(basePath: string): AsyncIterable<string> {
    try {
      await fs.access(basePath);

      const lstat = await fs.lstat(basePath);
      if (lstat.isFile()) {
        yield basePath;
      } else {
        for (const dirEntry of await fs.readdir(basePath)) {
          const dirEntryPath = path.resolve(basePath, dirEntry);
          yield* await listFiles(dirEntryPath);
        }
      }
    } catch (_) {
      // Nothing to do here
    }
  }

  return listFiles;
}

/**
 * Create a function to list the files at or under a path, folders *are*
 * processed recursively and filter out files based on the specified
 * {@link Filters}.
 *
 * @param listFiles A function to list files for a specific path.
 * @returns A function to list files at or under specific path(s).
 */
function createListFilesFiltered(
  listFiles: (basePath: string) => AsyncIterable<string>,
) {
  return async function*(
    basePaths: Iterable<string>,
    filters: Filters,
  ): AsyncIterable<string> {
    for (const basePath of basePaths) {
      for await (const filePath of listFiles(basePath)) {
        const extensions = filters.extensions;
        if (!hasSomeExtension(filePath, extensions)) {
          continue;
        }

        yield filePath;
      }
    }
  };
}

export {
  createListFiles,
  createListFilesFiltered,
};
