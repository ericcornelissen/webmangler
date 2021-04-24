import type { BenchmarkStats, BenchmarkRunStats } from "./types";

/**
 * Get the median from a list of numbers.
 *
 * @param numbers The numbers of interest.
 * @returns The median number.
 */
function medianOf(numbers: number[]): number {
  const sortedNumbers = numbers.sort((a, b) => a - b);

  const n = numbers.length;
  const middle = Math.floor(n / 2);
  if (n % 2) {
    return sortedNumbers[middle];
  }

  return (sortedNumbers[middle - 1] + sortedNumbers[middle]) / 2;
}

/**
 * Compute the {@link BenchmarkStats} from one or more {@link
 * BenchmarkRunStats}.
 *
 * @param results The individual {@link BenchmarkRunStats}.
 * @returns The {@link BenchmarkStats}.
 * @since v0.1.0
 */
export function computeStats(results: BenchmarkRunStats[]): BenchmarkStats {
  const durations = results.map((result) => result.duration);

  return {
    medianDuration: medianOf(durations),
  };
}
