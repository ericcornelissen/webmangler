import type { Logger } from "../logger";
import type { ManglerStats } from "./types";

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
 * Log statistics about a _WebMangler_ run.
 *
 * @param logger A {@link Logger}.
 * @param stats The _WebMangler_ run statistics.
 */
function logStats(
  logger: Logger,
  stats: ManglerStats,
): void {
  const fileCount: number = stats.files.size;
  const duration: number = roundToTwoDecimalPlaces(stats.duration);

  if (stats.files.size === 0) {
    return;
  }

  let overallBefore = 0;
  let overallAfter = 0;
  stats.files.forEach((fileStats, filePath) => {
    overallBefore += fileStats.sizeBefore;
    overallAfter += fileStats.sizeAfter;
    if (fileStats.changed) {
      const percentage = getDisplayPercentage(fileStats.changePercentage);
      const reduction = `${fileStats.sizeBefore} -> ${fileStats.sizeAfter}`;
      logger.print(`${filePath} ${percentage} (${reduction})`);
    } else {
      logger.print(`${filePath} [NOT MANGLED]`);
    }
  });

  const changedPercentage = getChangedPercentage(overallBefore, overallAfter);
  const overallPercentage = getDisplayPercentage(changedPercentage);
  const overallReduction = `${overallBefore} -> ${overallAfter}`;
  logger.print(`OVERALL ${overallPercentage} (${overallReduction})`);
  logger.print(`\nmangled ${fileCount} files in ${duration} ms`);
}

export {
  logStats,
};
