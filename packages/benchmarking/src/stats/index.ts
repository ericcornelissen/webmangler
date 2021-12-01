import type { BenchmarkRunStats, BenchmarkStats } from "./types";

import { newComputeStats } from "./compute";
import * as math from "./math";

/**
 * Compute the {@link BenchmarkStats} from one or more
 * {@link BenchmarkRunStats}.
 *
 * @param results The {@link BenchmarkRunStats}.
 * @returns The {@link BenchmarkStats}.
 */
const computeStats = newComputeStats(math);

export {
  computeStats,
};

export type {
  BenchmarkRunStats,
  BenchmarkStats,
};
