import type {
  CharSet,
  MangleExpressionOptions,
  WebManglerPlugin,
} from "@webmangler/types";

import type { CssVariableManglerOptions } from "./types";

import { SimpleManglerPlugin } from "@webmangler/mangler-utils";

/**
 * The type of the {@link CssVariableMangler} constructor.
 */
type CssVariableManglerConstructor = new (
  options?: CssVariableManglerOptions
) => WebManglerPlugin;

/**
 * The interface defining the dependencies of the {@link CssVariableMangler}
 * class.
 */
interface CssVariableManglerDependencies {
  /**
   * Get the {@link CharSet} for the {@link CssVariableMangler}.
   *
   * @param options The options provided to the {@link CssVariableMangler}.
   * @returns The {@link CharSet}.
   */
  getCharacterSet(
    options: Record<never, never>,
  ): CharSet;

  /**
   * Get the ignore patterns for the {@link CssVariableMangler}.
   *
   * @param options The options provided to the {@link CssVariableMangler}.
   * @returns The ignore patterns.
   */
   getIgnorePatterns(options: {
    ignoreCssVarNamePattern?: string | Iterable<string>;
  }): string | Iterable<string>;

  /**
   * Get the language options for the {@link CssVariableMangler}.
   *
   * @param options The options provided to the {@link CssVariableMangler}.
   * @returns The language options.
   */
   getLanguageOptions(
    options: Record<never, never>,
  ): Iterable<MangleExpressionOptions<unknown>>;

  /**
   * Get the patterns for the {@link CssVariableMangler}.
   *
   * @param options The options provided to the {@link CssVariableMangler}.
   * @returns The patterns.
   */
  getPatterns(options: {
    cssVarNamePattern?: string | Iterable<string>;
  }): string | Iterable<string>;

  /**
   * Get the mangle prefix for the {@link CssVariableMangler}.
   *
   * @param options The options provided to the {@link CssVariableMangler}.
   * @returns The mangle prefix.
   */
   getPrefix(options: {
    keepCssVarPrefix?: string;
  }): string;

  /**
   * Get the reserved names for the {@link CssVariableMangler}.
   *
   * @param options The options provided to the {@link CssVariableMangler}.
   * @returns The reserved names.
   */
  getReserved(options: {
    reservedCssVarNames?: Iterable<string>;
  }): Iterable<string>;
}

/**
 * Initialize the {@link CssVariableMangler} class with explicit dependencies.
 *
 * @param helpers The dependencies of the class.
 * @returns The {@link CssVariableMangler} class.
 */
function initCssVariableMangler(
  helpers: CssVariableManglerDependencies,
): CssVariableManglerConstructor {
  return class CssVariableMangler extends SimpleManglerPlugin {
    /**
     * Instantiate a new {@link CssVariableMangler}.
     *
     * @param options The {@link CssVariableManglerOptions}.
     * @since v0.1.0
     * @version v0.1.23
     */
    constructor(options: CssVariableManglerOptions={}) {
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

export default initCssVariableMangler;
