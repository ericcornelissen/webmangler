/**
 * Type defining a logger for the _WebMangler_ CLI.
 *
 * @since v0.1.2
 */
interface Logger {
  /**
   * Log a debug message.
   *
   * @param msg the message.
   * @since v0.1.2
   */
  debug(msg: string): void;

  /**
   * Log an informative message.
   *
   * @param msg the message.
   * @since v0.1.2
   */
  info(msg: string): void;

  /**
   * Log a warning message.
   *
   * @param msg the message.
   * @since v0.1.2
   */
  warn(msg: string): void;
}

/**
 * Type defining a function used to write a message, e.g. to STDOUT.
 *
 * @since v0.1.2
 */
type Writer = (msg: string) => void;

export type {
  Logger,
  Writer,
};
