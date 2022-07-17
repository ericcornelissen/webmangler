import type { ManglerStats, RawStatsData } from "./types";

import { getChangedPercentage } from "./helpers";

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
