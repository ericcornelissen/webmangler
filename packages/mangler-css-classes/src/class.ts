import type {
  CharSet,
  MangleExpressionOptions,
  WebManglerPlugin,
} from "@webmangler/types";

import type { CssClassManglerOptions } from "./types";

import { SimpleManglerPlugin } from "@webmangler/mangler-utils";

/**
 * The type of the {@link CssClassMangler} constructor.
 */
type CssClassManglerConstructor = new (
  options?: CssClassManglerOptions
) => WebManglerPlugin;

/**
 * The interface defining the dependencies of the {@link CssClassMangler} class.
 */
interface CssClassManglerDependencies {
  /**
   * Get the {@link CharSet} for the {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @returns The {@link CharSet}.
   */
  getCharacterSet(
    options: CssClassManglerOptions,
  ): CharSet;

  /**
   * Get the ignore patterns for the {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @returns The ignore patterns.
   */
  getIgnorePatterns(
    options: CssClassManglerOptions,
  ): string | Iterable<string>;

  /**
   * Get the language options for the {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @returns The language options.
   */
  getLanguageOptions(
    options: CssClassManglerOptions,
  ): Iterable<MangleExpressionOptions<unknown>>;

  /**
   * Get the patterns for the {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @returns The patterns.
   */
  getPatterns(
    options: CssClassManglerOptions,
  ): string | Iterable<string>;

  /**
   * Get the mangle prefix for the {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @returns The mangle prefix.
   */
  getPrefix(
    options: CssClassManglerOptions,
  ): string;

  /**
   * Get the reserved names for the {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @returns The reserved names.
   */
  getReserved(
    options: CssClassManglerOptions,
  ): Iterable<string>;
}

/**
 * Initialize the {@link CssClassMangler} class with explicit dependencies.
 *
 * @param helpers The dependencies of the class.
 * @returns The {@link CssClassMangler} class.
 */
function initCssClassMangler(
  helpers: CssClassManglerDependencies,
): CssClassManglerConstructor {
  return class CssClassMangler extends SimpleManglerPlugin {
    /**
     * Instantiate a new {@link CssClassMangler}.
     *
     * @param options The {@link CssClassManglerOptions}.
     * @since v0.1.0
     * @version v0.1.23
     */
    constructor(options: CssClassManglerOptions={}) {
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

export default initCssClassMangler;
