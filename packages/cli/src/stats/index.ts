import type { WebManglerCliFile } from "../fs";
import type { ManglerStats, RawStatsData } from "./types";

import * as fs from "node:fs";
import * as path from "node:path";

import { computeStats as _computeStats } from "./compute";
import { buildCommonDir } from "./paths";

const commonDir = buildCommonDir({
  dirname: path.dirname,
  lstat: fs.lstatSync,
  pathSeparator: path.sep,
});

/**
 * Create a function to transform {@link WebManglerCliFile}s to hide their full
 * path.
 *
 * @param projectRoot The path to the project root.
 * @returns A function to hide the full path from {@link WebManglerCliFile}.
 */
function createHideFullPath(projectRoot: string) {
  return (file: WebManglerCliFile): WebManglerCliFile => ({
    ...file,
    path: file.path.replace(projectRoot, ""),

    // Set explicitly because `size` may be get-property on `WebManglerCliFiles`
    size: file.size,
  });
}

/**
 * Compute the statistics about one _WebMangler_ run.
 *
 * @param data The {@link RawStatsData}.
 * @returns The {@link ManglerStats} for the run.
 */
function computeStats(data: RawStatsData): ManglerStats {
  const projectRoot = data.inFiles
    .map((file) => file.path)
    .reduce(
      (previousPath, currentPath) => commonDir(previousPath, currentPath),
      process.cwd(),
    );

  const hideFullPath = createHideFullPath(projectRoot);
  const inFiles = data.inFiles.map(hideFullPath);
  const outFiles = data.outFiles.map(hideFullPath);

  return _computeStats({
    ...data,
    inFiles,
    outFiles,
  });
}

export {
  computeStats,
};
