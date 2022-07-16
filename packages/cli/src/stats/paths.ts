/**
 * A function that returns the directory name that contains the provided path.
 *
 * @param path A file or directory path.
 * @returns A directory path.
 */
type Dirname = (path: string) => string;

/**
 * A function that returns the {@link LStats} for the provided path.
 *
 * @param path A file or directory path.
 * @returns The {@link LStats} for `path`.
 */
type LstatSync = (path: string) => LStats;

/**
 * A function that returns either 1) the provided path if it's a directory, or
 * 2) the directory name if the provided path is a file.
 *
 * @param path A file or directory path.
 * @returns A path to a directory.
 */
type Dir = (path: string) => string;

/**
 * A function that returns the (deepest) common directory of two paths.
 *
 * @param pathA An absolute file or directory path.
 * @param pathB An absolute file or directory path.
 * @returns An absolute path to a directory.
 * @throws If there's no common directory between `pathA` and `pathB`.
 */
type CommonDir = (pathA: string, pathB: string) => string;

/**
 * Provides information about a file system entity.
 */
interface LStats {
  /**
   * Returns whether the entity referenced by {@link LStats} is a file.
   *
   * @returns `true` if {@link LStats} references a file, `false` otherwise.
   */
  isFile(): boolean;
}

/**
 * Build a {@link Dir} function.
 *
 * @param params The required dependencies.
 * @param params.dirname See {@link Dirname}.
 * @param params.lstat See {@link LstatSync}.
 * @returns A function implementing {@link Dir}.
 */
function buildDir({
  dirname,
  lstat,
}: {
  dirname: Dirname;
  lstat: LstatSync;
}): Dir {
  return (path: string): string => {
    const stats = lstat(path);
    if (stats.isFile()) {
      return dirname(path);
    } else {
      return path;
    }
  };
}

/**
 * Build a {@link CommonDir} function.
 *
 * @param params The required dependencies.
 * @param params.dirname See {@link Dirname}.
 * @param params.lstat See {@link LstatSync}.
 * @param params.pathSeparator The path separator used by the OS.
 * @returns A function implementing {@link CommonDir}.
 */
function buildCommonDir({
  dirname,
  lstat,
  pathSeparator,
}: {
  dirname: Dirname;
  lstat: LstatSync;
  pathSeparator: string;
}): CommonDir {
  const dir = buildDir({ dirname, lstat });
  return (pathA: string, pathB: string): string => {
    const dirA = dir(pathA);
    const dirB = dir(pathB);

    const pathToA = dirA.split(pathSeparator);
    const pathToB = dirB.split(pathSeparator);
    const min = Math.min(pathToA.length, pathToB.length);

    const result = [];
    for (let i = 0; i < min; i++) {
      if (pathToA[i] === pathToB[i]) {
        result.push(pathToA[i]);
      } else {
        break;
      }
    }

    if (result.length === 0) {
      throw new Error("no common parent");
    }

    return result.join(pathSeparator) || pathSeparator;
  };
}

export {
  buildCommonDir,
};
