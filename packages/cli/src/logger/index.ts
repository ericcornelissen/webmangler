import type { Logger, Writer } from "./types";
import type { LogLevel } from "./level";

import { isDebug, isInfo, isWarn } from "./level";

/**
 * Utility function that does nothing.
 */
const NOOP: Writer = () => { /* Nothing to do */ };

/**
 * TODO
 *
 * @since v0.1.2
 */
export default class DefaultLogger implements Logger {
  /**
   * Function behind {@link DefaultLogger.debug}.
   */
  private readonly _debug: Writer;

  /**
   * Function behind {@link DefaultLogger.info}.
   */
  private readonly _info: Writer;

  /**
   * Function behind {@link DefaultLogger.warn}.
   */
  private readonly _warn: Writer;

  /**
   * Instantiate a new {@link Logger} at a certain level.
   *
   * @param level The log level.
   * @param writer The {@link Writer} to use for logging.
   * @since v0.1.2
   */
  constructor(level: LogLevel, writer: Writer) {
    this._debug = isDebug(level) ? writer : NOOP;
    this._info = isInfo(level) ? writer : NOOP;
    this._warn = isWarn(level) ? writer : NOOP;
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
  warn(msg: string): void {
    this._warn(`[WARN]  ${msg}`);
  }
}

export type {
  Logger,
  LogLevel,
  Writer,
};
