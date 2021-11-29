import type { BenchmarkStats, BenchmarkRunStats } from "./types";

/**
 * A collection a mathematical utilities to assist in computing stats.
 */
interface Math {
  /**
   * Get the median from a collection of numbers.
   *
   * @param numbers A collection of numbers.
   * @returns The median number.
   */
  medianOf(numbers: number[]): number;
}

/**
 * Instantiate a function to compute stats from a collection of
 * {@link BenchmarkRunStats}.
 *
 * @param math An instance of {@link Math}.
 * @returns A function to compute stats from {@link BenchmarkRunStats}.
 */
function newComputeStats(math: Math) {
  return (results: BenchmarkRunStats[]): BenchmarkStats => {
    const durations = results.map((result) => result.duration);

    return {
      medianDuration: math.medianOf(durations),
    };
  };
}

export {
  newComputeStats,
};
