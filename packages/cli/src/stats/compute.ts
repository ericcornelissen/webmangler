import type { WebManglerCliFile } from "../fs";
import type { ManglerStats } from "./types";

import { getChangedPercentage } from "./helpers";

/**
 * The raw data needed to compute stats about a _WebMangler_ run.
 */
interface RawStatsData {
  /**
   * The time it took to mangle.
   */
  readonly duration: number;

  /**
   * The files that were inputted to _WebMangler_.
   */
  readonly inFiles: WebManglerCliFile[];

  /**
   * The files that were outputted by _WebMangler_.
   */
  readonly outFiles: WebManglerCliFile[];
}

/**
 * Compute the statistics about one _WebMangler_ run.
 *
 * @param data The {@link RawStatsData}.
 * @returns The {@link ManglerStats} for the run.
 */
function computeStats(data: RawStatsData): ManglerStats {
  const { duration, inFiles, outFiles } = data;

  const fileStats = new Map();
  inFiles.forEach((inFile) => {
    const outFile = outFiles.find((file) => file.path === inFile.path);
    if (outFile === undefined) {
      fileStats.set(inFile.path, {
        changed: false,
        changePercentage: 0,
        sizeBefore: inFile.originalSize,
        sizeAfter: inFile.originalSize,
      });
    } else {
      fileStats.set(inFile.path, {
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

  let overallBefore = 0;
  let overallAfter = 0;
  fileStats.forEach(({ sizeAfter, sizeBefore }) => {
    overallBefore += sizeBefore;
    overallAfter += sizeAfter;
  });

  return {
    aggregate: {
      changed: overallBefore !== overallAfter,
      changePercentage: getChangedPercentage(overallBefore, overallAfter),
      sizeBefore: overallBefore,
      sizeAfter: overallAfter,
    },
    files: fileStats,
    duration: duration,
  };
}

export {
  computeStats,
};
