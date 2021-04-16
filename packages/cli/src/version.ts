import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const VERSION_MISSING = "[missing]";

const CLI_DIR = "webmangler-cli";
const MANIFEST_FILE = "package.json";
const NODE_MODULES_DIR = "node_modules";
const WEBMANGLER_DIR = "webmangler";

/**
 * The type representing the programs of which version information is provided.
 */
type VersionData = {
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
 * @param projectRoot The root of the project in which the dependency is.
 * @returns The _WebMangler_ CLI version (e.g. v0.1.1).
 */
function getWebManglerCliVersion(projectRoot: string): string {
  const manifestFilePath = path.resolve(
    projectRoot,
    NODE_MODULES_DIR,
    CLI_DIR,
    MANIFEST_FILE,
  );

  if (!fs.existsSync(manifestFilePath)) {
    return VERSION_MISSING;
  }

  const manifestRaw = fs.readFileSync(manifestFilePath).toString();
  const manifest = JSON.parse(manifestRaw);
  return `v${manifest.version}`;
}

/**
 * Get the version of _WebMangler_ dependency as a string.
 *
 * @param projectRoot The root of the project in which the dependency is.
 * @returns The _WebMangler_ version (e.g. v0.1.4).
 */
function getWebManglerVersion(projectRoot: string): string {
  const manifestFilePath = path.resolve(
    projectRoot,
    NODE_MODULES_DIR,
    WEBMANGLER_DIR,
    MANIFEST_FILE,
  );

  if (!fs.existsSync(manifestFilePath)) {
    return VERSION_MISSING;
  }

  const manifestRaw = fs.readFileSync(manifestFilePath).toString();
  const manifest = JSON.parse(manifestRaw);
  return `v${manifest.version}`;
}

/**
 * Get the version of NodeJS as a string.
 *
 * @returns The NodeJS version (e.g. v12.16.0).
 */
function getNodeVersion(): string {
  return execFileSync("node", ["--version"]).toString();
}

/**
 * Get the {@link VersionData} relevant to the _WebMangler_ CLI.
 *
 * @returns The {@link VersionData}.
 */
export function getVersionsData(): VersionData {
  const projectRoot = process.cwd();

  return {
    cli: getWebManglerCliVersion(projectRoot),
    core: getWebManglerVersion(projectRoot),
    node: getNodeVersion(),
  };
}
