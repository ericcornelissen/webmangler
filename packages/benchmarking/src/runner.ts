import type {
  BenchmarkCallback,
  BenchmarkParameters,
  BenchmarkSetup,
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
 * Given the {@link BenchmarkParameters}, returns the number of repetitions.
 *
 * @param params The {@link BenchmarkParameters}.
 * @returns The number of repetitions.
 */
function getRepetitions(params: BenchmarkParameters): number {
  return params.repetitions || DEFAULT_REPETITIONS;
}

/**
 * Given the {@link BenchmarkParameters}, returns the setup function.
 *
 * @param params The {@link BenchmarkParameters}.
 * @returns The setup function, or a dummy setup function.
 */
function getSetupFn(params: BenchmarkParameters): BenchmarkSetup {
  const NOOP: BenchmarkSetup = () => null;
  return params.setup || NOOP;
}

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
  const fn = params.fn;
  const setupFn = getSetupFn(params);
  const repetitions = getRepetitions(params);

  const results: BenchmarkRunStats[] = [];
  for (let n = 0; n < repetitions; n++) {
    setupFn();
    const runStats = measureOneRun(fn);
    results.push(runStats);
  }

  return computeStats(results);
}
