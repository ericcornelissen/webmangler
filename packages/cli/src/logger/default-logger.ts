import type { LogLevel } from "./level";
import type { Logger, Writer } from "./types";

/**
 * The interface defining the dependencies of the {@link DefaultLogger} class.
 */
interface DefaultLoggerDependencies {
  /**
   * Check if a given {@link LogLevel} enables debug-level logging.
   *
   * @param logLevel A {@link LogLevel}.
   * @returns `true` if debug-level logging is enabled, `false` otherwise.
   */
  isDebug(logLevel: LogLevel): boolean;

  /**
   * Check if a given {@link LogLevel} enables info-level logging.
   *
   * @param logLevel A {@link LogLevel}.
   * @returns `true` if info-level logging is enabled, `false` otherwise.
   */
  isInfo(logLevel: LogLevel): boolean;

  /**
   * Check if a given {@link LogLevel} disables all logging.
   *
   * @param logLevel A {@link LogLevel}.
   * @returns `true` if logging is disabled, `false` otherwise.
   */
  isSilent(logLevel: LogLevel): boolean;

  /**
   * Check if a given {@link LogLevel} enables warn-level logging.
   *
   * @param logLevel A {@link LogLevel}.
   * @returns `true` if warn-level logging is enabled, `false` otherwise.
   */
  isWarn(logLevel: LogLevel): boolean;
}

/**
 * Utility function that does nothing.
 */
const NOOP: Writer = () => {
  // Nothing to do
};

/**
 * Initialize the {@link DefaultLogger} class with explicit dependencies.
 *
 * @param helpers The {@link DefaultLoggerDependencies}.
 * @returns An instantiable {@link Logger}.
 */
function initDefaultLogger(helpers: DefaultLoggerDependencies) {
  const { isDebug, isInfo, isSilent, isWarn } = helpers;
  return class DefaultLogger implements Logger {
    /**
     * The function behind {@link DefaultLogger.debug}.
     */
    private readonly _debug: Writer;

    /**
     * The function behind {@link DefaultLogger.info}.
     */
    private readonly _info: Writer;

    /**
     * The function behind {@link DefaultLogger.print}.
     */
    private readonly _print: Writer;

    /**
     * The function behind {@link DefaultLogger.warn}.
     */
    private readonly _warn: Writer;

    /**
     * Instantiate a new {@link Logger} at a certain level.
     *
     * @param logLevel The {@link LogLevel}.
     * @param writer The {@link Writer} to use for logging.
     * @since v0.1.2
     */
    constructor(logLevel: LogLevel, writer: Writer) {
      this._debug = isDebug(logLevel) ? writer : NOOP;
      this._info = isInfo(logLevel) ? writer : NOOP;
      this._print = isSilent(logLevel) ? NOOP : writer;
      this._warn = isWarn(logLevel) ? writer : NOOP;
    }

    /**
     * @inheritDoc
     */
    debug(msg: string): void {
      this._debug(`[DEBUG] ${msg}`);
    }

    /**
     * @inheritDoc
     */
    info(msg: string): void {
      this._info(`[INFO]  ${msg}`);
    }

    /**
     * @inheritDoc
     */
    print(msg: string): void {
      this._print(msg);
    }

    /**
     * @inheritDoc
     */
    warn(msg: string): void {
      this._warn(`[WARN]  ${msg}`);
    }
  };
}

export {
  initDefaultLogger,
};
