import type { BenchmarkRunStats } from "../stats";

/**
 * The minimum required behaviour of functions to benchmark.
 *
 * @since v0.1.0
 */
type BenchmarkCallback = () => void;

/**
 * The parameters for benchmarking a function.
 *
 * @since v0.1.1
 */
type BenchmarkParameters = {
  /**
   * To function to benchmark.
   *
   * @since v0.1.1
   */
  readonly fn: BenchmarkCallback;

  /**
   * A function to prepare a benchmark run. This function is called before every
   * benchmark repetition and its resources ARE NOT included in the benchmarking
   * results.
   *
   * @since v0.1.1
   * @default `() => { }`
   */
  readonly setup?: BenchmarkSetup;

  /**
   * The number of repetitions. This can be increased to improve the reliability
   * of the measurements.
   *
   * NOTE: This number is assumed to be greater than 0. If it is less than or
   * equal to 0, the package behaviour is not defined.
   *
   * @since v0.1.1
   * @default {@link DEFAULT_REPETITIONS}.
   */
  readonly repetitions?: number;
}

/**
 * The behaviour of a benchmark run setup.
 *
 * @since v0.1.1
 */
type BenchmarkSetup = () => void;

export type {
  BenchmarkCallback,
  BenchmarkParameters,
  BenchmarkRunStats,
  BenchmarkSetup,
};
