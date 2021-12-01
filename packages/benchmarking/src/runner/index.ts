import type { BenchmarkCallback, BenchmarkParameters } from "./types";

import { performance } from "perf_hooks";

import * as config from "./config";
import { newDoBenchmark, newMeasureOneRun } from "./run";
import { newGetNow } from "./time";

/**
 * Get a timestamp representing now.
 *
 * @returns A timestamp.
 */
const getNow = newGetNow(performance);

/**
 * Measure statistics about a single function execution.
 *
 * @param fn The function to benchmark.
 * @returns The statistics of the function execution.
 */
const measureOneRun = newMeasureOneRun({
  getNow,
});

/**
 * Benchmark a function. I.e. run it many times and measure its performance.
 *
 * The number of repetitions can be tweaked to improve the reliability of the
 * measurements. By default {@link DEFAULT_REPETITIONS} repetitions are used.
 *
 * NOTE: The behaviour of this function below 1 repetitions is not defined.
 *
 * @param params The {@link BenchmarkParameters}.
 * @returns The per-run benchmarking results.
 */
const doBenchmark = newDoBenchmark({
  config,
  measureOneRun,
});

export {
  doBenchmark,
};

export type {
  BenchmarkCallback,
  BenchmarkParameters,
};
