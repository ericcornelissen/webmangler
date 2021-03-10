import * as fs from "fs";
import * as path from "path";
import { performance } from "perf_hooks";

type BenchmarkCallback = () => void;

/**
 * The statistics returned when benchmarking.
 */
type BenchmarkStats = {
  /**
   * The median duration in milliseconds of `n` runs.
   */
  medianDuration: number;
};

/**
 * The statistics of a single function execution.
 */
type BenchmarkRunStats = {
  /**
   * The duration in milliseconds of a run.
   */
  duration: number;
};

/**
 * The default number of repetitions when benchmarking a function.
 */
const DEFAULT_REPETITIONS = 100;

/**
 * The absolute path to the testdata directory.
 */
const TEST_DATA_DIR = path.resolve(
  __dirname,
  "..", // /packages/core/src/languages
  "..", // /packages/core/src
  "..", // /packages/core
  "..", // /packages
  "..", // /
  "testdata",
);

/**
 * Get the median from a list of numbers.
 *
 * @param numbers The numbers of interest.
 * @returns The median number.
 */
function medianOf(numbers: number[]): number {
  const sortedNumbers = numbers.sort();
  const n = sortedNumbers.length;
  if (n % 2 === 0) {
    return sortedNumbers[n / 2];
  } else {
    const _n = Math.ceil(n / 2);
    return sortedNumbers[_n];
  }
}

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
 * @param fn The function to benchmark.
 * @param [repetitions] The number of repetitions.
 * @returns The benchmarking results.
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

  return {
    medianDuration: medianOf(results.map((result) => result.duration)),
  };
}

/**
 * Read a file from the `/testdata` directory in the repository.
 *
 * @param fileName The name of the file in `/testdata`.
 * @returns The file contents.
 */
export function readFile(fileName: string): string {
  const filePath = path.resolve(TEST_DATA_DIR, fileName);
  const fileBuffer = fs.readFileSync(filePath);
  const fileContent = fileBuffer.toString();
  return fileContent;
}
