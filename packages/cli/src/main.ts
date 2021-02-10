
import type { WebManglerCliArgs } from "./types";

import webmangler from "webmangler";

import getConfiguration from "./config";
import { DEFAULT_CONFIG_PATHS } from "./constants";
import * as fs from "./fs";
import { getStatsBetween, logStats } from "./stats";

/**
 * Run _WebMangler_ on the CLI specified configuration.
 *
 * @param args The CLI arguments.
 */
export default function run(args: WebManglerCliArgs): void {
  const config = getConfiguration(args.config, DEFAULT_CONFIG_PATHS);
  const inFiles = fs.readFiles(args._);

  const outFiles = webmangler(inFiles, config);

  if (args.stats) {
    const stats = getStatsBetween(inFiles, outFiles);
    // eslint-disable-next-line no-console
    logStats(console.log, stats);
  }

  if (args.write) {
    fs.writeFiles(outFiles);
  }
}
