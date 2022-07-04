import type {
  ManglerStats,
  Reporter,
  Writer,
} from "./types";

/**
 * The configuration options of a {@link JsonReporter}.
 *
 * @since v0.1.9
 */
interface JsonReporterOptions {
  /**
   * Should the JSON be pretty-printed.
   *
   * @default false
   * @since v0.1.9
   */
  readonly prettyPrint?: boolean;
}

/**
 * The JSON (JavaScript Object Notation) reporter for the _WebMangler_ CLI.
 *
 * @since v0.1.8
 * @version v0.1.9
 */
class JsonReporter implements Reporter {
  /**
   * The value for the `space` (third) argument of `JSON.stringify`.
   */
  private readonly jsonStringifySpace?: string;

  /**
   * Create a new {@link JsonReporter}.
   *
   * @param params The {@link JsonReporterOptions}.
   * @since v0.1.9
   */
  constructor(params?: JsonReporterOptions) {
    if (params?.prettyPrint) {
      this.jsonStringifySpace = "\t";
    }
  }

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

    const statsAsJson = JSON.stringify(stats, null, this.jsonStringifySpace);
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
