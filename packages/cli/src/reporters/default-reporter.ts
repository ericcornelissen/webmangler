import type {
  AggregateStats,
  FileStats,
  ManglerStats,
  Reporter,
  Writer,
} from "./types";

import * as chalk from "chalk";

/**
 * The default reporter for the _WebMangler_ CLI.
 */
class DefaultReporter implements Reporter {
  /**
   * @inheritDoc
   */
  async report(writer: Writer, stats: ManglerStats): Promise<void> {
    const fileCount: number = stats.files.size;
    const duration: number = this.roundToTwoDecimalPlaces(stats.duration);

    if (stats.files.size === 0) {
      writer.write(`Nothing was mangled (${duration} ms)`);
      return;
    }

    stats.files.forEach((fileStats: FileStats, filePath: string) => {
      this.reportFile(writer, fileStats, filePath);
    });

    this.reportAggregated(writer, stats.aggregate);
    writer.write(`\nmangled ${fileCount} files in ${duration} ms`);
  }

  /**
   * Report the aggregated mangle stats.
   *
   * @param writer A {@link Writer}.
   * @param stats The aggregated stats.
   */
  private reportAggregated(writer: Writer, stats: AggregateStats): void {
    const overallPercentage = this.getDisplayPercentage(stats);
    const overallReduction = this.getNumericChangeString(stats);
    writer.write(`OVERALL ${overallPercentage} (${overallReduction})`);
  }

  /**
   * Report the mangle stats for one file.
   *
   * @param writer A {@link Writer}.
   * @param stats The {@link FileStats}.
   * @param filepath The path to the file of which the `stats` are.
   */
  private reportFile(writer: Writer, stats: FileStats, filepath: string): void {
    if (stats.changed) {
      const percentage = this.getDisplayPercentage(stats);
      const reduction = this.getNumericChangeString(stats);
      writer.write(`${filepath} ${percentage} (${reduction})`);
    } else {
      writer.write(`${filepath} [NOT MANGLED]`);
    }
  }

  /**
   * Create a string representing a numeric change.
   *
   * @param params The method parameters.
   * @param params.sizeAfter The numeric size after.
   * @param params.sizeBefore The numeric size before.
   * @returns The numeric change represented as a string.
   */
  private getNumericChangeString({ sizeAfter, sizeBefore }: {
    sizeAfter: number;
    sizeBefore: number;
  }): string {
    return `${sizeBefore} -> ${sizeAfter}`;
  }

  /**
   * Convert a percentage as number to a percentage for output.
   *
   * @param params The method parameters.
   * @param params.changePercentage The percentage as a number.
   * @returns The percentage string (without %).
   */
  private getDisplayPercentage({ changePercentage }: {
    changePercentage: number;
  }): string {
    if (changePercentage < 0) {
      if (changePercentage > -0.01) {
        return chalk.green("<-0.01%");
      }

      const roundedPercentage = this.roundToTwoDecimalPlaces(changePercentage);
      return chalk.greenBright(`${roundedPercentage}%`);
    } else if (changePercentage > 0) {
      if (changePercentage < 0.01) {
        return chalk.red("<+0.01%");
      }

      const roundedPercentage = this.roundToTwoDecimalPlaces(changePercentage);
      return chalk.redBright(`+${roundedPercentage}%`);
    } else {
      return chalk.gray("0%");
    }
  }

  /**
   * Round a number to at most two decimal places.
   *
   * @param x The number of interest.
   * @returns The number rounded.
   */
  private roundToTwoDecimalPlaces(x: number): number {
    const rounded = Math.round((x + Number.EPSILON) * 100) / 100;
    return rounded;
  }
}

export default DefaultReporter;
