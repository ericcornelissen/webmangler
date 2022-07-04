/**
 * The statistics of a single function execution.
 */
interface BenchmarkRunStats {
  /**
   * The duration in milliseconds of a run.
   */
  readonly duration: number;
}

/**
 * The statistics returned when benchmarking.
 *
 * @since v0.1.0
 */
interface BenchmarkStats {
  /**
   * The median duration in milliseconds of `n` runs.
   *
   * @since v0.1.0
   */
  medianDuration: number;
}

export type {
  BenchmarkRunStats,
  BenchmarkStats,
};
