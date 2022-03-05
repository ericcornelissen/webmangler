import type { Reporter, Stats, Writer } from "./types";

import * as chalk from "chalk";

/**
 * Round a number to at most two decimal places.
 *
 * @param x The number of interest.
 * @returns The number rounded.
 */
function roundToTwoDecimalPlaces(x: number): number {
  const rounded = Math.round((x + Number.EPSILON) * 100) / 100;
  return rounded;
}

/**
 * Convert a percentage as number to a percentage for output.
 *
 * @param percentage The percentage as a number.
 * @returns The percentage string (without %).
 */
function getDisplayPercentage(percentage: number): string {
  if (percentage < 0) {
    if (percentage > -0.01) {
      return chalk.green("<-0.01%");
    }

    const roundedPercentage = roundToTwoDecimalPlaces(percentage);
    return chalk.greenBright(`${roundedPercentage}%`);
  } else if (percentage > 0) {
    if (percentage < 0.01) {
      return chalk.red("<+0.01%");
    }

    const roundedPercentage = roundToTwoDecimalPlaces(percentage);
    return chalk.redBright(`+${roundedPercentage}%`);
  } else {
    return chalk.gray("0%");
  }
}

/**
 * Log statistics about a _WebMangler_ run.
 *
 * @param writer A {@link Writer}.
 * @param stats The _WebMangler_ run statistics.
 */
function logStats(
  writer: Writer,
  stats: Stats,
): void {
  const fileCount: number = stats.files.size;
  const duration: number = roundToTwoDecimalPlaces(stats.duration);

  if (stats.files.size === 0) {
    writer.write(`Nothing was mangled (${duration} ms)`);
    return;
  }

  stats.files.forEach((fileStats, filePath) => {
    if (fileStats.changed) {
      const percentage = getDisplayPercentage(fileStats.changePercentage);
      const reduction = `${fileStats.sizeBefore} -> ${fileStats.sizeAfter}`;
      writer.write(`${filePath} ${percentage} (${reduction})`);
    } else {
      writer.write(`${filePath} [NOT MANGLED]`);
    }
  });

  const aggregate = stats.aggregate;
  const overallPercentage = getDisplayPercentage(aggregate.changePercentage);
  const overallReduction = `${aggregate.sizeBefore} -> ${aggregate.sizeAfter}`;
  writer.write(`OVERALL ${overallPercentage} (${overallReduction})`);
  writer.write(`\nmangled ${fileCount} files in ${duration} ms`);
}

/**
 * The default reporter for the _WebMangler_ CLI.
 */
class DefaultReporter implements Reporter {
  /**
   * The function used to write the report.
   */
  private readonly writer: Writer;

  /**
   * Create a new {@link DefaultReporter}.
   *
   * @param writer The {@link Writer} to be used by this {@link Reporter}.
   */
  constructor(writer: Writer) {
    this.writer = writer;
  }

  /**
   * @inheritDoc
   */
  async report(stats: Stats): Promise<void> {
    logStats(this.writer, stats);
  }
}

export default DefaultReporter;
