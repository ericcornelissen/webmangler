import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";

/**
 * Get the version of the _WebMangler_ CLI dependency as a string.
 *
 * @param projectRoot The root of the project in which the dependency is.
 * @returns The _WebMangler_ CLI version (e.g. v0.1.1).
 */
function getWebManglerCliVersion(projectRoot: string): string {
  const manifestFilePath = path.resolve(
    projectRoot,
    "node_modules",
    "webmangler-cli",
    "package.json",
  );
  if (!fs.existsSync(manifestFilePath)) {
    return "[missing]";
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
    "node_modules",
    "webmangler",
    "package.json",
  );
  if (!fs.existsSync(manifestFilePath)) {
    return "[missing]";
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
 * Get the version message for the _WebMangler_ CLI.
 *
 * @returns The version message.
 */
export default function getVersionMessage(): string {
  const projectRoot = process.cwd();
  const webManglerCliVersion = getWebManglerCliVersion(projectRoot);
  const webManglerVersion = getWebManglerVersion(projectRoot);
  const nodeVersion = getNodeVersion();

  return [
    `WebMangler CLI : ${webManglerCliVersion}`,
    `WebMangler     : ${webManglerVersion}`,
    `NodeJS         : ${nodeVersion}`,
  ].join("\n").trim();
}
