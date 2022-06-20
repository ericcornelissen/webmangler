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
    const statsAsJson = JSON.stringify(manglerStats);
    writer.write(statsAsJson);
  }
}

export default JsonReporter;
