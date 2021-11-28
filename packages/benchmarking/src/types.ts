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
 */
export type BenchmarkRunStats = {
  /**
   * The duration in milliseconds of a run.
   */
  duration: number;
};
