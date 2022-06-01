import type { WebManglerOptions } from "@webmangler/types";

import type { Reporter } from "../reporters";

/**
 * Type defining the available configuration for the _WebMangler_ CLI.
 *
 * @since v0.1.8
 */
type WebManglerCliConfig = Required<WebManglerCliOptions>;

/**
 * Type defining the available options for the _WebMangler_ CLI.
 *
 * @since v0.1.8
 */
interface WebManglerCliOptions extends WebManglerOptions {
  /**
   * The reporters to be used by the _WebMangler_ CLI.
   *
   * @since v0.1.8
   */
  reporters?: Iterable<Reporter>;
}

export type {
  WebManglerCliConfig,
  WebManglerCliOptions,
};
