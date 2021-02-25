/* eslint-disable no-console */

import type { WebManglerCliArgs } from "./types";

import webmangler from "webmangler";

import getConfiguration from "./config";
import * as fs from "./fs";
import Logger from "./logger";
import { getStatsBetween, logStats } from "./stats";

/**
 * Run _WebMangler_ on the CLI specified configuration.
 *
 * @param args The CLI arguments.
 */
export default function run(args: WebManglerCliArgs): void {
  const logger = new Logger(args.verbose, console.log);

  logger.debug("reading configuration...");
  const config = getConfiguration(args.config);
  logger.debug("configuration read");

  logger.debug("reading files provided on the CLI...");
  const inFiles = fs.readFilesInAll(
    args._,
    config.languages.map((plugin) => plugin.getLanguages()).flat(),
  );
  logger.debug(`found ${inFiles.length} files`);

  logger.debug(`mangling ${inFiles.length} files...`);
  const outFiles = webmangler(inFiles, config);
  logger.debug(`${outFiles.length} files mangled`);

  if (args.stats) {
    logger.debug("computing stats...");
    const stats = getStatsBetween(inFiles, outFiles);
    logger.debug("stats computed");
    logger.debug("logging stats...");
    logStats(console.log, stats);
    logger.debug("stats logged");
  }

  if (args.write) {
    logger.debug(`writing ${outFiles.length} mangled files...`);
    fs.writeFiles(outFiles);
    logger.debug("mangled files written");
  } else {
    logger.debug("writing disabled, not writing mangled files");
  }
}
