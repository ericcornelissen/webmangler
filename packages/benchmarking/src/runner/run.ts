import type {
  BenchmarkCallback,
  BenchmarkParameters,
  BenchmarkRunStats,
  BenchmarkSetup,
} from "./types";

/**
 * A collection of utilities to parse the configuration of the
 * {@link newDoBenchmark} function.
 */
interface DoBenchmarkConfigUtils {
  /**
   * Given the {@link BenchmarkParameters} returns the number of repetitions.
   *
   * @param params The {@link BenchmarkParameters}.
   * @returns The number of repetitions.
   */
  getRepetitions(params: BenchmarkParameters): number;

  /**
   * Given the {@link BenchmarkParameters} returns the setup function.
   *
   * @param params The {@link BenchmarkParameters}.
   * @returns The setup function.
   */
  getSetupFn(params: BenchmarkParameters): BenchmarkSetup;
}

/**
 * The dependencies of the {@link newDoBenchmark} function.
 */
interface DoBenchmarkParams {
  /**
   * A {@link DoBenchmarkConfigUtils} instance.
   */
  readonly config: DoBenchmarkConfigUtils;

  /**
   * Measure the performance of a single function execution.
   *
   * @param fn The function to measure.
   * @returns The {@link BenchmarkRunStats}.
   */
  measureOneRun(fn: BenchmarkCallback): BenchmarkRunStats;
}

/**
 * Build, with explicit dependencies, a function to benchmark functions.
 *
 * @param params The function's dependencies.
 * @param params.config Utilities to parse the benchmark configuration.
 * @param params.measureOneRun A utility to measure a function's performance.
 * @returns A function to benchmark functions.
 */
function newDoBenchmark({
  config,
  measureOneRun,
}: DoBenchmarkParams) {
  return (params: BenchmarkParameters): BenchmarkRunStats[] => {
    const fn = params.fn;
    const setupFn = config.getSetupFn(params);
    const repetitions = config.getRepetitions(params);

    const results: BenchmarkRunStats[] = [];
    for (let n = 0; n < repetitions; n++) {
      setupFn();
      const runStats = measureOneRun(fn);
      results.push(runStats);
    }

    return results;
  };
}

/**
 * The dependencies of the {@link newMeasureOneRun} function.
 */
interface MeasureOneRunParams {
  /**
   * Get the current time as a number.
   *
   * @returns The current time as a number.
   */
  getNow(): number;
}

/**
 * Build, with explicit dependencies, a function to measure a function's
 * performance.
 *
 * @param params The function's dependencies.
 * @param params.getNow A function to get the current time.
 * @returns A function to measure a function's performance.
 */
function newMeasureOneRun({
  getNow,
}: MeasureOneRunParams) {
  return (fn: BenchmarkCallback): BenchmarkRunStats => {
    const tStart = getNow();
    fn();
    const tEnd = getNow();

    const duration = tEnd - tStart;
    return { duration };
  };
}

export {
  newDoBenchmark,
  newMeasureOneRun,
};
