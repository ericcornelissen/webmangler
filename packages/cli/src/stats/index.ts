import type { ManglerStats, SimpleLogger } from "./types";
import type { WebManglerCliFile } from "../fs";

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
export function logStats(log: SimpleLogger, stats: ManglerStats): void {
  stats.forEach((fileStats, filePath) => {
    if (fileStats.changed) {
      const percentage = fileStats.changePercentage;
      const reduction = `${fileStats.sizeBefore} -> ${fileStats.sizeAfter}`;
      log(`${filePath} ${percentage}% (${reduction})`);
    } else {
      log(`${filePath} [NOT MANGLED]`);
    }
  });
}
