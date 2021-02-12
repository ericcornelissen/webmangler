import type { ManglerStats } from "./types";
import type { WebManglerCliFile } from "../fs";

import { getChangedPercentage } from "./helpers";

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
export function logStats(
  log: (msg: string) => void,
  stats: ManglerStats,
): void {
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
