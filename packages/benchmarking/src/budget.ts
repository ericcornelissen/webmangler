import * as os from "os";

/**
 * Get an estimate of the current speed of the CPU in MHz.
 *
 * @returns The CPU speed in MHz.
 */
function getCpuSpeedInMHz(): number {
  const cpus = os.cpus();
  return cpus.reduce((acc, cpu) => acc + cpu.speed, 0) / cpus.length;
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
 * @since v0.1.0
 */
export function getRuntimeBudget(budgetInMillis: number): number {
  const stdCpuSpeedInMhz = 2500;

  const cpuSpeedInMhz = getCpuSpeedInMHz();
  return (budgetInMillis * stdCpuSpeedInMhz) / cpuSpeedInMhz;
}
