import type {
  BenchmarkCallback,
  BenchmarkStats,
  BenchmarkRunStats,
} from "./types";

import { performance } from "perf_hooks";

import { computeStats } from "./stats";

/**
 * The default number of repetitions when benchmarking a function.
 */
const DEFAULT_REPETITIONS = 200;

/**
 * Get a timestamp representing now.
 *
 * @returns A timestamp.
 */
function getNow(): number {
  return performance.now();
}

/**
 * Measure statistics about a single function execution.
 *
 * @param fn The function to benchmark.
 * @returns The statistics of the function execution.
 */
function measureOneRun(fn: BenchmarkCallback): BenchmarkRunStats {
  const tStart = getNow();
  fn();
  const tEnd = getNow();

  const duration = tEnd - tStart;
  return { duration };
}

/**
 * Benchmark a function. I.e. run it many times and measure its performance.
 *
 * The number of repetitions can be tweaked to improve the reliability of the
 * measurements. By default {@link DEFAULT_REPETITIONS} repetitions are used.
 *
 * NOTE: The behaviour of this function below 1 repetitions is not defined.
 *
 * @param fn The function to benchmark.
 * @param [repetitions] The number of repetitions.
 * @returns The benchmarking results.
 * @since v0.1.0
 */
export function benchmarkFn(
  fn: BenchmarkCallback,
  repetitions: number = DEFAULT_REPETITIONS,
): BenchmarkStats {
  const results: BenchmarkRunStats[] = [];
  for (let n = 0; n < repetitions; n++) {
    const runStats = measureOneRun(fn);
    results.push(runStats);
  }

  return computeStats(results);
}
