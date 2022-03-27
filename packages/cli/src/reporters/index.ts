import type { Reporter, Writer } from "./types";

import DefaultReporter from "./default-reporter";

/**
 * Create a new {@link Reporter}.
 *
 * @param writer A {@link Writer} to use when writing reports.
 * @returns A new {@link Reporter}.
 */
function New(writer: Writer): Reporter { // eslint-disable-line @typescript-eslint/no-unused-vars
  const reporter = new DefaultReporter();
  return reporter;
}

export {
  DefaultReporter,
  New,
};

export type {
  Reporter,
};
