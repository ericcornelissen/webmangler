import type { ManglerStats } from "../stats/types";

/**
 * A reporter is an object that can report {@link Stats}.
 */
interface Reporter {
  /**
   * Report {@link Stats}.
   *
   * @param stats The {@link Stats} to report.
   */
  report(stats: Stats): Promise<void>;
}

/**
 * The statistics that {@link Reporter}s write.
 */
type Stats = ManglerStats;

/**
 * A writer is an object that can be used to write messages.
 */
interface Writer {
  /**
   * Write a message.
   *
   * @param msg The message to write.
   */
  write(msg: string): void;
}

export type {
  Reporter,
  Stats,
  Writer,
};
