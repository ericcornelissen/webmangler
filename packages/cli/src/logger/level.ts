/**
 * Type defining the available log levels.
 *
 * The log levels are as follows:
 * - `-1`: Completely silent.
 * -  `0`: Warning messages only.
 * -  `1`: Informative messages and below.
 * -  `2`: Debug messages and below.
 *
 * @since v0.1.2
 */
type LogLevel = -1 | 0 | 1 | 2;

/**
 * The integer representing silent, or no, logging.
 */
const LEVEL_SILENT: LogLevel = -1;

/**
 * The integer representing warn-level logging.
 */
const LEVEL_WARN: LogLevel = 0;

/**
 * The integer representing info-level logging.
 */
const LEVEL_INFO: LogLevel = 1;

/**
 * The integer representing debug-level logging.
 */
const LEVEL_DEBUG: LogLevel = 2;

/**
 * Check with a given log level indicates debug logging.
 *
 * @param level The log level of interest.
 * @returns `true` if `level` is debug, `false` otherwise.
 */
function isDebug(level: LogLevel): boolean {
  return level >= LEVEL_DEBUG;
}

/**
 * Check with a given log level indicates info logging.
 *
 * @param level The log level of interest.
 * @returns `true` if `level` is info, `false` otherwise.
 */
function isInfo(level: LogLevel): boolean {
  return level >= LEVEL_INFO;
}

/**
 * Check with a given log level indicates silent logging.
 *
 * @param level The log level of interest.
 * @returns `true` if `level` is silent, `false` otherwise.
 */
function isSilent(level: LogLevel): boolean {
  return level <= LEVEL_SILENT;
}

/**
 * Check with a given log level indicates warn logging.
 *
 * @param level The log level of interest.
 * @returns `true` if `level` is warn, `false` otherwise.
 */
function isWarn(level: LogLevel): boolean {
  return level >= LEVEL_WARN;
}

export {
  isDebug,
  isInfo,
  isSilent,
  isWarn,
};

export type {
  LogLevel,
};
