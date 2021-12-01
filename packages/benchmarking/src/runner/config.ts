import type { BenchmarkParameters, BenchmarkSetup } from "./types";

/**
 * The default number of repetitions when benchmarking a function.
 */
const DEFAULT_REPETITIONS = 200;

/**
 * A function that does nothing.
 *
 * @returns Nothing.
 */
const NOOP: BenchmarkSetup = () => null;

/**
 * Given the {@link BenchmarkParameters} returns the number of repetitions.
 *
 * @param params The {@link BenchmarkParameters}.
 * @returns The number of repetitions.
 */
function getRepetitions(
  params: Pick<BenchmarkParameters, "repetitions">,
): number {
  return params.repetitions || DEFAULT_REPETITIONS;
}

/**
 * Given the {@link BenchmarkParameters} returns the setup function.
 *
 * @param params The {@link BenchmarkParameters}.
 * @returns The setup function.
 */
function getSetupFn(
  params: Pick<BenchmarkParameters, "setup">,
): BenchmarkSetup {
  return params.setup || NOOP;
}

export {
  getRepetitions,
  getSetupFn,
};
