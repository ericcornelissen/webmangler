import * as fs from "fs";
import * as os from "os";
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
 * Get the speed of the CPU in MHz of the current system.
 *
 * @returns The CPU speed in MHz.
 */
function getCpuSpeedInMHz(): number {
  const cpus = os.cpus();
  const firstCpu = cpus[0];
  return firstCpu.speed;
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
 * Get the runtime budget for a machine given an expected runtime for a
 * "default" system.
 *
 * A "default" system is defined as:
 * - having a 2.5 GHz processor.
 *
 * @param budgetInMillis The budget in milliseconds on a "default" system.
 * @returns The budget in milliseconds for the current system.
 */
export function getRuntimeBudget(budgetInMillis: number): number {
  const stdCpuSpeedInMhz = 2500;

  const cpuSpeedInMhz = getCpuSpeedInMHz();
  return (budgetInMillis * stdCpuSpeedInMhz) / cpuSpeedInMhz;
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
