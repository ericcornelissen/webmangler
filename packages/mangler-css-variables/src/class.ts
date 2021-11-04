import type {
  CharSet,
  MangleExpressionOptions,
  WebManglerPlugin,
} from "@webmangler/types";

import type { CssVariableManglerOptions } from "./types";

import {
  ALL_LETTER_CHARS,
  ALL_NUMBER_CHARS,
  SimpleManglerPlugin,
} from "@webmangler/mangler-utils";

type CssVariableManglerConstructor = new (
  options?: CssVariableManglerOptions
) => WebManglerPlugin;

interface CssVariableManglerDependencies {
  getPatterns(
    cssVarNamePattern?: string | Iterable<string>,
  ): string | Iterable<string>;

  getIgnorePatterns(
    ignoreCssVarNamePattern?: string | Iterable<string>,
  ): string | Iterable<string>;

  getReserved(reservedCssVarNames?: Iterable<string>): Iterable<string>;

  getPrefix(keepCssVarPrefix?: string): string;

  getCssVariableDefinitionExpressionOptions(): MangleExpressionOptions<unknown>;

  getCssVariableUsageExpressionOptions(): MangleExpressionOptions<unknown>;
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
     * The character set used by {@link CssVariableMangler}.
     */
    private static readonly CHARACTER_SET: CharSet = [
      ...ALL_LETTER_CHARS,
      ...ALL_NUMBER_CHARS,
      "-", "_",
    ];

    /**
     * Instantiate a new {@link CssVariableMangler}.
     *
     * @param options The {@link CssVariableManglerOptions}.
     * @since v0.1.0
     * @version v0.1.23
     */
    constructor(options: CssVariableManglerOptions={}) {
      super({
        charSet: CssVariableMangler.CHARACTER_SET,
        patterns: helpers.getPatterns(options.cssVarNamePattern),
        ignorePatterns: helpers.getIgnorePatterns(
          options.ignoreCssVarNamePattern,
        ),
        reserved: helpers.getReserved(options.reservedCssVarNames),
        prefix: helpers.getPrefix(options.keepCssVarPrefix),
        languageOptions: [
          helpers.getCssVariableDefinitionExpressionOptions(),
          helpers.getCssVariableUsageExpressionOptions(),
        ],
      });
    }
  };
}

export default initCssVariableMangler;
