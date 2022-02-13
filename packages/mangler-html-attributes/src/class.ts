import type {
  CharSet,
  MangleExpressionOptions,
  WebManglerPlugin,
} from "@webmangler/types";

import type { HtmlAttributeManglerOptions } from "./types";

import { SimpleManglerPlugin } from "@webmangler/mangler-utils";

/**
 * The type of the {@link HtmlAttributeMangler} constructor.
 */
type HtmlAttributeManglerConstructor = new (
  options?: HtmlAttributeManglerOptions
) => WebManglerPlugin;

/**
 * The interface defining the dependencies of the {@link HtmlAttributeMangler}
 * class.
 */
interface HtmlAttributeManglerDependencies {
  /**
   * Get the {@link CharSet} for the {@link HtmlAttributeMangler}.
   *
   * @returns The {@link CharSet}.
   */
  getCharacterSet(): CharSet;

  /**
   * Get the ignore patterns for the {@link HtmlAttributeMangler}.
   *
   * @param ignoreAttrNamePattern The configured ignore patterns.
   * @returns The ignore patterns.
   */
  getIgnorePatterns(
    ignoreAttrNamePattern?: string | Iterable<string>,
  ): string | Iterable<string>;

  /**
   * Get the language options for the {@link HtmlAttributeMangler}.
   *
   * @returns The language options.
   */
  getLanguageOptions(): Iterable<MangleExpressionOptions<unknown>>;

  /**
   * Get the patterns for the {@link HtmlAttributeMangler}.
   *
   * @param attrNamePattern The configured patterns.
   * @returns The patterns.
   */
  getPatterns(
    attrNamePattern?: string | Iterable<string>,
  ): string | Iterable<string>;

  /**
   * Get the mangle prefix for the {@link HtmlAttributeMangler}.
   *
   * @param keepAttrPrefix The configured prefix.
   * @returns The mangle prefix.
   */
  getPrefix(
    keepAttrPrefix?: string,
  ): string;

  /**
   * Get the reserved names for the {@link HtmlAttributeMangler}.
   *
   * @param reservedAttrNames The configured reserved names.
   * @returns The reserved names.
   */
  getReserved(
    reservedAttrNames?: Iterable<string>,
  ): Iterable<string>;
}

/**
 * Initialize the {@link HtmlAttributeMangler} class with explicit dependencies.
 *
 * @param helpers The dependencies of the class.
 * @returns The {@link HtmlAttributeMangler} class.
 */
function initHtmlAttributeMangler(
  helpers: HtmlAttributeManglerDependencies,
): HtmlAttributeManglerConstructor {
  return class HtmlAttributeMangler extends SimpleManglerPlugin {
    /**
     * Instantiate a new {@link HtmlAttributeMangler}.
     *
     * @param options The {@link HtmlAttributeManglerOptions}.
     * @since v0.1.0
     * @version v0.1.23
     */
    constructor(options: HtmlAttributeManglerOptions={}) {
      super({
        charSet: helpers.getCharacterSet(),
        patterns: helpers.getPatterns(options.attrNamePattern),
        ignorePatterns: helpers.getIgnorePatterns(options.ignoreAttrNamePattern),
        reserved: helpers.getReserved(options.reservedAttrNames),
        prefix: helpers.getPrefix(options.keepAttrPrefix),
        languageOptions: helpers.getLanguageOptions(),
      });
    }
  };
}

export default initHtmlAttributeMangler;
