/**
 * The parameters for {@link newGetRuntimeBudget}.
 */
interface Params {
  /**
   * A function that returns an estimate for the CPU speed of the current
   * system.
   */
  getCpuSpeedInMHz(): number;
}

/**
 * Instantiate a function to compute the runtime budget for a machine given an
 * expected runtime for a "default" system.
 *
 * @param params The {@link Params}.
 * @param params.getCpuSpeedInMHz A function to get a CPU speed estimate.
 * @returns A function to compute a runtime budget for the current system.
 */
function newGetRuntimeBudget({
  getCpuSpeedInMHz,
}: Params) {
  const stdCpuSpeedInMhz = 2500;
  return (budgetInMs: number): number => {
    const cpuSpeedInMhz = getCpuSpeedInMHz();
    return (budgetInMs * stdCpuSpeedInMhz) / cpuSpeedInMhz;
  };
}

export {
  newGetRuntimeBudget,
};
