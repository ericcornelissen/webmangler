import type { ManglerStats } from "./types";
import type { WebManglerCliFile } from "../fs";

import * as chalk from "chalk";

import { getChangedPercentage } from "./helpers";

/**
 * Round a number to at most two decimal places.
 *
 * @param x The number of interest.
 * @returns The number rounded.
 */
function roundToTwoDecimalPlaces(x: number): number {
  const rounded = Math.round((x + Number.EPSILON) * 100) / 100;
  return rounded;
}

/**
 * Convert a percentage as number to a percentage for output.
 *
 * @param percentage The percentage as a number.
 * @returns The percentage string (without %).
 */
function getDisplayPercentage(percentage: number): string {
  if (percentage < 0) {
    if (percentage > -0.01) {
      return chalk.green("<-0.01%");
    }

    const roundedPercentage = roundToTwoDecimalPlaces(percentage);
    return chalk.greenBright(`${roundedPercentage}%`);
  } else if (percentage > 0) {
    if (percentage < 0.01) {
      return chalk.red("<+0.01%");
    }

    const roundedPercentage = roundToTwoDecimalPlaces(percentage);
    return chalk.redBright(`+${roundedPercentage}%`);
  } else {
    return chalk.gray("0%");
  }
}

/**
 * Compute the statistics about one _WebMangler_ run.
 *
 * @param inFiles The files selected for mangling.
 * @param outFiles The files after mangling.
 * @returns The {@link ManglerStats} for the run.
 */
export function getStatsBetween(
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
 * @param log A function to take a string and log it.
 * @param stats The _WebMangler_ run statistics.
 */
export function logStats(
  log: (msg: string) => void,
  stats: ManglerStats,
): void {
  let overallBefore = 0;
  let overallAfter = 0;
  stats.forEach((fileStats, filePath) => {
    overallBefore += fileStats.sizeBefore;
    overallAfter += fileStats.sizeAfter;
    if (fileStats.changed) {
      const percentage = getDisplayPercentage(fileStats.changePercentage);
      const reduction = `${fileStats.sizeBefore} -> ${fileStats.sizeAfter}`;
      log(`${filePath} ${percentage} (${reduction})`);
    } else {
      log(`${filePath} [NOT MANGLED]`);
    }
  });

  if (stats.size > 0) {
    const changedPercentage = getChangedPercentage(overallBefore, overallAfter);
    const percentage = getDisplayPercentage(changedPercentage);
    const reduction = `${overallBefore} -> ${overallAfter}`;
    log(`OVERALL ${percentage} (${reduction})`);
  }
}
