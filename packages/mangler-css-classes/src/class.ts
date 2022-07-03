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
   * @returns The {@link CharSet}.
   */
  getCharacterSet(): CharSet;

  /**
   * Get the ignore patterns for the {@link CssClassMangler}.
   *
   * @param ignoreClassNamePattern The configured ignore patterns.
   * @returns The ignore patterns.
   */
  getIgnorePatterns(
    ignoreClassNamePattern?: string | Iterable<string>,
  ): string | Iterable<string>;

  /**
   * Get the language options for the {@link CssClassMangler}.
   *
   * @param options The options provided to the {@link CssClassMangler}.
   * @returns The language options.
   */
  getLanguageOptions(
    options: Record<never, never>,
  ): Iterable<MangleExpressionOptions<unknown>>;

  /**
   * Get the patterns for the {@link CssClassMangler}.
   *
   * @param classNamePattern The configured patterns.
   * @returns The patterns.
   */
  getPatterns(
    classNamePattern?: string | Iterable<string>,
  ): string | Iterable<string>;

  /**
   * Get the mangle prefix for the {@link CssClassMangler}.
   *
   * @param keepClassNamePrefix The configured prefix.
   * @returns The mangle prefix.
   */
  getPrefix(
    keepClassNamePrefix?: string,
  ): string;

  /**
   * Get the reserved names for the {@link CssClassMangler}.
   *
   * @param reservedClassNames The configured reserved names.
   * @returns The reserved names.
   */
  getReserved(
    reservedClassNames?: Iterable<string>,
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
        charSet: helpers.getCharacterSet(),
        patterns: helpers.getPatterns(options.classNamePattern),
        ignorePatterns: helpers.getIgnorePatterns(
          options.ignoreClassNamePattern,
        ),
        reserved: helpers.getReserved(options.reservedClassNames),
        prefix: helpers.getPrefix(options.keepClassNamePrefix),
        languageOptions: helpers.getLanguageOptions(options),
      });
    }
  };
}

export default initCssClassMangler;
