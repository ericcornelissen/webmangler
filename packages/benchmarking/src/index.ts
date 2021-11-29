import type { BenchmarkCallback, BenchmarkParameters } from "./runner";
import type { BenchmarkStats } from "./stats";

import { doBenchmark } from "./runner";
import { computeStats } from "./stats";

/**
 * Benchmark a function. I.e. run it many times and measure its performance.
 *
 * The number of repetitions can be tweaked to improve the reliability of the
 * measurements. By default {@link DEFAULT_REPETITIONS} repetitions are used.
 *
 * NOTE: The behaviour of this function below 1 repetitions is not defined.
 *
 * @param params The {@link BenchmarkParameters}.
 * @returns The benchmarking results.
 * @since v0.1.0
 * @version v0.1.1
 */
export function benchmarkFn(params: BenchmarkParameters): BenchmarkStats {
  const runsData = doBenchmark(params);
  const results = computeStats(runsData);
  return results;
}

export { getRuntimeBudget } from "./budget";

export type { BenchmarkCallback, BenchmarkStats };
