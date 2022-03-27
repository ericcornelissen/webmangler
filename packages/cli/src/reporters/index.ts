import type { Reporter, Writer } from "./types";

import DefaultReporter from "./default-reporter";

/**
 * Create a new {@link Reporter}.
 *
 * @param writer A {@link Writer} to use when writing reports.
 * @returns A new {@link Reporter}.
 */
function New(writer: Writer): Reporter {
  const reporter = new DefaultReporter(writer);
  return reporter;
}

export {
  New,
};

export type {
  Reporter,
};
