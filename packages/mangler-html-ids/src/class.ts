import type {
  CharSet,
  MangleExpressionOptions,
  WebManglerPlugin,
} from "@webmangler/types";

import type { HtmlIdManglerOptions } from "./types";

import { SimpleManglerPlugin } from "@webmangler/mangler-utils";

/**
 * The type of the {@link HtmlIdMangler} constructor.
 */
type HtmlIdManglerConstructor = new (
  options?: HtmlIdManglerOptions
) => WebManglerPlugin;

/**
 * The interface defining the dependencies of the {@link HtmlIdMangler}
 * class.
 */
interface HtmlIdManglerDependencies {
  /**
   * Get the {@link CharSet} for the {@link HtmlIdMangler}.
   *
   * @param options The options provided to the {@link HtmlIdMangler}.
   * @returns The {@link CharSet}.
   */
  getCharacterSet(
    options: Record<never, never>,
  ): CharSet;

  /**
   * Get the ignore patterns for the {@link HtmlIdMangler}.
   *
   * @param options The options provided to the {@link HtmlIdMangler}.
   * @returns The ignore patterns.
   */
  getIgnorePatterns(options: {
    ignoreIdNamePattern?: string | Iterable<string>;
  }): string | Iterable<string>;

  /**
   * Get the language options for the {@link HtmlIdMangler}.
   *
   * @param options The options provided to the {@link HtmlIdMangler}.
   * @returns The language options.
   */
  getLanguageOptions(options: {
    idAttributes?: Iterable<string>;
    urlAttributes?: Iterable<string>;
  }): Iterable<MangleExpressionOptions<unknown>>;

  /**
   * Get the patterns for the {@link HtmlIdMangler}.
   *
   * @param options The options provided to the {@link HtmlIdMangler}.
   * @returns The patterns.
   */
  getPatterns(options: {
    idNamePattern?: string | Iterable<string>;
  }): string | Iterable<string>;

  /**
   * Get the mangle prefix for the {@link HtmlIdMangler}.
   *
   * @param options The options provided to the {@link HtmlIdMangler}.
   * @returns The mangle prefix.
   */
  getPrefix(options: {
    keepIdPrefix?: string;
  }): string;

  /**
   * Get the reserved names for the {@link HtmlIdMangler}.
   *
   * @param options The options provided to the {@link HtmlIdMangler}.
   * @returns The reserved names.
   */
  getReserved(options: {
    reservedIds?: Iterable<string>;
  }): Iterable<string>;
}

/**
 * Initialize the {@link HtmlIdMangler} class with explicit dependencies.
 *
 * @param helpers The dependencies of the class.
 * @returns The {@link HtmlIdMangler} class.
 */
function initHtmlIdMangler(
  helpers: HtmlIdManglerDependencies,
): HtmlIdManglerConstructor {
  return class HtmlIdMangler extends SimpleManglerPlugin {
    /**
     * Instantiate a new {@link HtmlIdMangler}.
     *
     * @param options The {@link HtmlIdManglerOptions}.
     * @since v0.1.0
     * @version v0.1.23
     */
    constructor(options: HtmlIdManglerOptions={}) {
      super({
        charSet: helpers.getCharacterSet(options),
        patterns: helpers.getPatterns(options),
        ignorePatterns: helpers.getIgnorePatterns(options),
        reserved: helpers.getReserved(options),
        prefix: helpers.getPrefix(options),
        languageOptions: helpers.getLanguageOptions(options),
      });
    }
  };
}

export default initHtmlIdMangler;
