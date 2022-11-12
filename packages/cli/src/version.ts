const VERSION_MISSING = "[missing]";

const CLI_DIR = "@webmangler/cli";
const MANIFEST_FILE = "package.json";
const NODE_MODULES_DIR = "node_modules";
const WEBMANGLER_DIR = "@webmangler/core";

/**
 * An interface to interact with the file system.
 */
interface FileSystem {
  /**
   * Check if a file exists at a given path or not.
   *
   * @param filepath The path of the file to open.
   * @param flags The file system flags (e.g. `"r"`).
   * @returns A file handle.
   */
  openSync(filepath: string, flags: number | string): number;

  /**
   * Read a file at a given path.
   *
   * @param file The file to read.
   * @returns The file content as a {@link Buffer}.
   */
  readFileSync(file: number | string): Buffer;
}

/**
 * An interface to manipulate paths.
 */
interface Path {
  /**
   * Resolve a list of paths into an absolute path.
   *
   * @param args The parts of the path.
   * @returns An absolute path based on the provided `args`.
   */
  resolve(...args: string[]): string;
}

/**
 * An interface for information about the current process.
 */
interface Process {
  /**
   * Get the current working directory (cwd) of the process.
   *
   * @returns The current working directory.
   */
  cwd(): string;
}

/**
 * An interface of a function to run a command.
 */
type RunCommand = (cmd: string, args: Iterable<string>) => Buffer;

/**
 * The type representing the programs of which version information is provided.
 */
interface VersionData {
  /**
   * The version of the _Webmangler_ CLI.
   */
  readonly cli: string;

  /**
   * The version of the _Webmangler_ core.
   */
  readonly core: string;

  /**
   * The version of NodeJS.
   */
  readonly node: string;
}

/**
 * Get the version of the _WebMangler_ CLI dependency as a string.
 *
 * @param fs A {@link FileSystem}.
 * @param path A {@link Path}.
 * @param projectRoot The root of the project in which the dependency is.
 * @returns The _WebMangler_ CLI version (e.g. v0.1.1).
 */
function getWebManglerCliVersion(
  fs: FileSystem,
  path: Path,
  projectRoot: string,
): string {
  try {
    const manifestFilePath = path.resolve(
      projectRoot,
      NODE_MODULES_DIR,
      CLI_DIR,
      MANIFEST_FILE,
    );

    const manifestFileHandle = fs.openSync(manifestFilePath, "r");
    const manifestRaw = fs.readFileSync(manifestFileHandle).toString();
    const manifest = JSON.parse(manifestRaw);
    return `v${manifest.version}`;
  } catch (_) {
    return VERSION_MISSING;
  }
}

/**
 * Get the version of _WebMangler_ dependency as a string.
 *
 * @param fs A {@link FileSystem}.
 * @param path A {@link Path}.
 * @param projectRoot The root of the project in which the dependency is.
 * @returns The _WebMangler_ version (e.g. v0.1.4).
 */
function getWebManglerVersion(
  fs: FileSystem,
  path: Path,
  projectRoot: string,
): string {
  try {
    const manifestFilePath = path.resolve(
      projectRoot,
      NODE_MODULES_DIR,
      WEBMANGLER_DIR,
      MANIFEST_FILE,
    );

    const manifestFileHandle = fs.openSync(manifestFilePath, "r");
    const manifestRaw = fs.readFileSync(manifestFileHandle).toString();
    const manifest = JSON.parse(manifestRaw);
    return `v${manifest.version}`;
  } catch (_) {
    return VERSION_MISSING;
  }
}

/**
 * Get the version of NodeJS as a string.
 *
 * @param run A utility to run commands.
 * @returns The NodeJS version (e.g. v12.16.0).
 */
function getNodeVersion(run: RunCommand): string {
  return run("node", ["--version"]).toString();
}

/**
 * Get the {@link VersionData} relevant to the _WebMangler_ CLI.
 *
 * @param fs A {@link FileSystem}.
 * @param path A {@link Path}.
 * @param process The system process value.
 * @param run A utility to run commands.
 * @returns The {@link VersionData}.
 */
function getVersionsData(
  fs: FileSystem,
  path: Path,
  process: Process,
  run: RunCommand,
): VersionData {
  const projectRoot = process.cwd();

  return {
    cli: getWebManglerCliVersion(fs, path, projectRoot),
    core: getWebManglerVersion(fs, path, projectRoot),
    node: getNodeVersion(run),
  };
}

export {
  getVersionsData,
};
