import type { WebManglerCliFile } from "./fs";
import type { WebManglerCliArgs } from "./types";

import webmangler from "webmangler";

import getConfiguration from "./config";
import { DEFAULT_CONFIG_PATHS } from "./constants";
import * as fs from "./fs";

/**
 * Statistics about an individually mangled file.
 */
type FileStats = {
  /**
   * Did the file size change.
   */
  readonly changed: boolean;

  /**
   * The amount of change as a percentage.
   */
  readonly changePercentage: number;

  /**
   * The file size before mangling.
   */
  readonly sizeBefore: number;

  /**
   * The file size after mangling.
   */
  readonly sizeAfter: number;
}

/**
 * Statistics about a _WebMangler_ run.
 */
type ManglerStats = Map<string, FileStats>;

/**
 * Get the percentage change between two numbers. The result is rounded to two
 * decimal places.
 *
 * @param before The before number.
 * @param after The after number.
 * @returns The percentage difference between `before` and `after`.
 */
function getChangedPercentage(before: number, after: number): number {
  const rawPercentage = (after - before) / after;
  return Math.round((rawPercentage + Number.EPSILON) * 100) / 100;
}

/**
 * Compute the statics about one _WebMangler_ run.
 *
 * @param inFiles The files selected for mangling.
 * @param outFiles The files after mangling.
 * @returns The {@link ManglerStats} for the run.
 */
function compareStats(
  inFiles: WebManglerCliFile[],
  outFiles: WebManglerCliFile[],
): ManglerStats {
  const stats = new Map();
  inFiles.forEach((inFile) => {
    const outFile = outFiles.find((outFile) => outFile.path === inFile.path);
    if (outFile === undefined) {
      stats.set(inFile.path, {
        changed: false,
        changePercentage: 0,
        sizeBefore: inFile.originalSize,
        sizeAfter: inFile.originalSize,
      });
    } else {
      stats.set(inFile.path, {
        changed: true,
        changePercentage: getChangedPercentage(
          inFile.originalSize,
          outFile.size,
        ),
        sizeBefore: inFile.originalSize,
        sizeAfter: outFile.size,
      });
    }
  });

  return stats;
}

/**
 * Log statistics about a _WebMangler_ run to stdout.
 *
 * @param stats The _WebMangler_ run statistics.
 */
function logStats(stats: ManglerStats): void {
  stats.forEach((fileStats, filePath) => {
    if (fileStats.changed) {
      const percentage = fileStats.changePercentage;
      const reduction = `${fileStats.sizeBefore} -> ${fileStats.sizeAfter}`;
      // eslint-disable-next-line no-console
      console.log(`${filePath} ${percentage}% (${reduction})`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`${filePath} [NOT MANGLED]`);
    }
  });
}

/**
 * Run _WebMangler_ on the CLI specified configuration.
 *
 * @param args The CLI arguments.
 */
export default function run(args: WebManglerCliArgs): void {
  const config = getConfiguration(args.config, DEFAULT_CONFIG_PATHS);
  const inFiles = fs.readFiles(args._);

  const outFiles = webmangler(inFiles, config);

  const stats = compareStats(inFiles, outFiles);
  logStats(stats);

  if (args.write) {
    fs.writeFiles(outFiles);
  }
}
