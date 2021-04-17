/**
 * The minimum required behaviour of functions to benchmark.
 *
 * @since v0.1.0
 */
export type BenchmarkCallback = () => void;

/**
 * The statistics returned when benchmarking.
 *
 * @since v0.1.0
 */
export type BenchmarkStats = {
  /**
   * The median duration in milliseconds of `n` runs.
   *
   * @since v0.1.0
   */
  medianDuration: number;
};

/**
 * The statistics of a single function execution.
 *
 * @since v0.1.0
 */
export type BenchmarkRunStats = {
  /**
   * The duration in milliseconds of a run.
   *
   * @since v0.1.0
   */
  duration: number;
};
