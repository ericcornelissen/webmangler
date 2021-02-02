import type { WebManglerCliArgs, WebManglerCliFile } from "./types";

import * as fs from "fs";
import * as path from "path";
import webmangler from "webmangler";

import getConfiguration from "./config";
import { DEFAULT_CONFIG_PATHS } from "./constants";

/**
 * Read a list of files from disk.
 *
 * @param filePaths The file paths of the files to read.
 * @returns The files read and converted into {@link ManglerFile}.
 */
function readFiles(filePaths: string[]): WebManglerCliFile[] {
  const files: WebManglerCliFile[] = [];
  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      // TODO `path not found ${filePath}`
      continue;
    }

    const lstat = fs.lstatSync(filePath);
    if (lstat.isFile()) {
      files.push({
        content: fs.readFileSync(filePath).toString(),
        path: filePath,
        type: path.extname(filePath).substring(1),
      });
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
function writeFiles(files: WebManglerCliFile[]): void {
  files.forEach((file) => {
    fs.writeFileSync(file.path, file.content);
  });
}

/**
 * Run _WebMangler_ on the CLI specified configuration.
 *
 * @param args The CLI arguments.
 */
export default function run(args: WebManglerCliArgs): void {
  const config = getConfiguration(args.config, DEFAULT_CONFIG_PATHS);
  const inFiles = readFiles(args._);

  const outFiles = webmangler(inFiles, config);
  if (args.write) {
    writeFiles(outFiles as WebManglerCliFile[]);
  }
}
