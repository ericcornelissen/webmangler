import type { Reporter, Writer } from "./types";

/**
 * Create a new {@link Reporter}.
 *
 * @param writer A {@link Writer} to use when writing reports.
 * @returns A new {@link Reporter}.
 */
function New(writer: Writer): Reporter {
  const reporter = {
    async report() {
      // Nothing to do here...
    },
  };
  return reporter;
}

export {
  New,
};
