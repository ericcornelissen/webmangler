/**
 * Represents a single system CPU.
 */
interface CPU {
  /**
   * The CPU speed in MHz.
   */
  readonly speed: number;
}

/**
 * Represents a computer system.
 */
interface System {
  /**
   * Get information about the {@link CPU}s on the current system.
   */
  cpus(): ReadonlyArray<CPU>;
}

/**
 * Instantiate a function to obtain the estimated clock speed of the current
 * system.
 *
 * NOTE: This function assumes there is at least one CPU on the system.
 *
 * @param system An instance of {@link System}.
 * @returns A function to obtain the estimated clock speed of the system in MHz.
 */
function newGetCpuSpeedInMHz(system: System) {
  return (): number => {
    const cpus = system.cpus();
    return cpus.reduce((acc, cpu) => acc + cpu.speed, 0) / cpus.length;
  };
}

export {
  newGetCpuSpeedInMHz,
};

export type {
  CPU,
  System,
};
