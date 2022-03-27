import type { AggregateStats, FileStats, ManglerStats } from "../stats/types";

/**
 * A reporter is an object that can report {@link Stats}.
 */
interface Reporter {
  /**
   * Report {@link Stats}.
   *
   * @param writer A {@link Writer}.
   * @param stats The {@link Stats} to report.
   */
  report(writer: Writer, stats: ManglerStats): Promise<void>;
}

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
  AggregateStats,
  FileStats,
  ManglerStats,
  Reporter,
  Writer,
};
