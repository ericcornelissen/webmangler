import type {
  ManglerStats,
  Reporter,
  Writer,
} from "./types";

/**
 * The JSON (JavaScript Object Notation) reporter for the _WebMangler_ CLI.
 *
 * @since v0.1.8
 */
class JsonReporter implements Reporter {
  /**
   * @inheritDoc
   */
  async report(
    writer: Writer,
    manglerStats: ManglerStats,
  ): Promise<void> {
    const stats = {
      aggregate: this.getAggregate(manglerStats),
      duration: this.getDuration(manglerStats),
      perFile: this.getPerFile(manglerStats),
    };

    const statsAsJson = JSON.stringify(stats);
    writer.write(statsAsJson);
  }

  getAggregate(manglerStats: ManglerStats) {
    return manglerStats.aggregate;
  }

  getDuration(manglerStats: ManglerStats) {
    return manglerStats.duration;
  }

  getPerFile(manglerStats: ManglerStats) {
    return Object.fromEntries(manglerStats.files);
  }
}

export default JsonReporter;
