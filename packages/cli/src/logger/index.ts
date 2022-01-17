import type { LogLevel } from "./level";
import type { Logger, Writer } from "./types";

import { initDefaultLogger } from "./default-logger";
import { isDebug, isInfo, isSilent, isWarn } from "./level";

/**
 * The default {@link Logger} used by the _WebMangler_ CLI.
 *
 * @since v0.1.2
 */
const DefaultLogger = initDefaultLogger({
  isDebug,
  isInfo,
  isSilent,
  isWarn,
});

export default DefaultLogger;

export type {
  Logger,
  LogLevel,
  Writer,
};
