import type { WebManglerOptions } from "@webmangler/core";

import type { WebManglerCliArgs } from "./types";
import type { Writer } from "./logger";

import webmangler from "@webmangler/core";

import getConfiguration from "./config";
import * as fs from "./fs";
import Logger from "./logger";
import { computeStats } from "./stats";
import { timeCall } from "./timing";

/**
 * Get the list of extension to read.
 *
 * @param config The {@link WebManglerOptions}.
 * @returns A collection of extensions.
 */
function getExtensionsFilter(config: WebManglerOptions): Iterable<string> {
  const result: Set<string> = new Set();
  for (const plugin of config.languages) {
    const languages = plugin.getLanguages();
    for (const language of languages) {
      result.add(language);
    }
  }

  return result;
}

/**
 * Run _WebMangler_ on the CLI specified configuration.
 *
 * @param args The CLI arguments.
 * @param writer A {@link Writer} to print with.
 */
export default async function run(
  args: WebManglerCliArgs,
  writer: Writer,
): Promise<void> {
  const logger = new Logger(args.verbose, writer);

  logger.debug("reading configuration...");
  const config = getConfiguration(args.config);
  logger.debug("configuration read");

  logger.debug("reading files provided on the CLI...");
  const extensions = getExtensionsFilter(config);
  const inFiles = await fs.readFilesFiltered(args._, { extensions });
  logger.debug(`found ${inFiles.length} files`);

  logger.debug(`mangling ${inFiles.length} files...`);
  const [duration, result] = timeCall(() => webmangler(inFiles, config));
  const outFiles = result.files;
  logger.debug(`${outFiles.length} files mangled`);

  if (args.stats) {
    logger.debug("computing stats...");
    const stats = computeStats({ inFiles, outFiles, duration });
    logger.debug("stats computed");
    logger.debug("reporting stats...");
    for (const reporter of config.reporters) {
      reporter.report({ write: writer }, stats);
    }
    logger.debug("stats reported");
  }

  if (args.write) {
    logger.debug(`writing ${outFiles.length} mangled files...`);
    await fs.writeFiles(outFiles);
    logger.debug("mangled files written");
  } else {
    logger.debug("writing disabled, not writing mangled files");
  }
}
