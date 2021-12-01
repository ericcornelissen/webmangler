import * as os from "os";

import { newGetRuntimeBudget } from "./compute";
import { newGetCpuSpeedInMHz } from "./system";

/**
 * Get an estimate of the current speed of the CPU in MHz.
 *
 * @returns The CPU speed in MHz.
 */
const getCpuSpeedInMHz = newGetCpuSpeedInMHz(os);

/**
 * Get the runtime budget for a machine given an expected runtime for a
 * "default" system.
 *
 * A "default" system is defined as:
 * - having a 2.5 GHz processor.
 *
 * @param budgetInMs The budget in milliseconds on a "default" system.
 * @returns The budget in milliseconds for the current system.
 * @since v0.1.0
 */
const getRuntimeBudget = newGetRuntimeBudget({
  getCpuSpeedInMHz,
});

export {
  getRuntimeBudget,
};
