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
   * @param options The options provided to the {@link HtmlAttributeMangler}.
   * @returns The {@link CharSet}.
   */
  getCharacterSet(
    options: Record<never, never>,
  ): CharSet;

  /**
   * Get the ignore patterns for the {@link HtmlAttributeMangler}.
   *
   * @param options The options provided to the {@link HtmlAttributeMangler}.
   * @returns The ignore patterns.
   */
  getIgnorePatterns(options: {
    ignoreAttrNamePattern?: string | Iterable<string>;
  }): string | Iterable<string>;

  /**
   * Get the language options for the {@link HtmlAttributeMangler}.
   *
   * @param options The options provided to the {@link HtmlAttributeMangler}.
   * @returns The language options.
   */
  getLanguageOptions(
    options: Record<never, never>,
  ): Iterable<MangleExpressionOptions<unknown>>;

  /**
   * Get the patterns for the {@link HtmlAttributeMangler}.
   *
   * @param options The options provided to the {@link HtmlAttributeMangler}.
   * @returns The patterns.
   */
  getPatterns(options: {
    attrNamePattern?: string | Iterable<string>;
  }): string | Iterable<string>;

  /**
   * Get the mangle prefix for the {@link HtmlAttributeMangler}.
   *
   * @param options The options provided to the {@link HtmlAttributeMangler}.
   * @returns The mangle prefix.
   */
  getPrefix(options: {
    keepAttrPrefix?: string;
  }): string;

  /**
   * Get the reserved names for the {@link HtmlAttributeMangler}.
   *
   * @param options The options provided to the {@link HtmlAttributeMangler}.
   * @returns The reserved names.
   */
  getReserved(options: {
    reservedAttrNames?: Iterable<string>;
  }): Iterable<string>;
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

export default initHtmlAttributeMangler;
