import type { CharSet } from "@webmangler/types";

import type { CssVariableManglerOptions } from "./types";

import {
  ALL_LETTER_CHARS,
  ALL_NUMBER_CHARS,
  SimpleManglerPlugin,
} from "@webmangler/mangler-utils";

import * as helpers from "./helpers";

/**
 * The CSS variables mangler is a built-in plugin of _WebMangler_ that can be
 * used to mangle CSS variables, e.g. "--color" in `--color: #ABC;`.
 *
 * This mangler can be configured using the {@link CssVariableManglerOptions}.
 *
 * The simplest way to configure this mangler is by specifying a single pattern
 * of CSS variables to mangle, e.g. all lowercase-only CSS variables:
 *
 * ```javascript
 * new CssVariableMangler({ cssVarNamePattern: "[a-z-]+" });
 * ```
 *
 * NOTE: the "--" prefix of CSS variables should not be included in the pattern.
 *
 * For more fine-grained control or easier-to-read patterns, you can specify
 * multiple patterns. For example, to mangle only the CSS variables for colors
 * and fonts (provided you consistently prefix those CSS variables with "clr"
 * and "font" resp.), you can use:
 *
 * ```javascript
 * new CssVariableMangler({ cssVarNamePattern: ["clr-[a-z]+", "font-[a-z]+"] });
 *
 * // Which is equivalent to:
 * new CssVariableMangler({ cssVarNamePattern: "(clr|font)-[a-z]+" });
 * ```
 *
 * If you don't specify any patterns the {@link CssVariableMangler.
 * DEFAULT_PATTERNS} will be used.
 *
 * ## Examples
 *
 * _The following examples assume the usage of the built-in language plugins._
 *
 * ### CSS
 *
 * Using the default configuration (`new CssVariableMangler()`) on the CSS:
 *
 * ```css
 * :root {
 *   --color-red: red;
 *   --color-blue: blue;
 * }
 *
 * p {
 *   background-color: var(--color-blue);
 *   color: var(--color-red);
 * }
 *
 * div {
 *   --color-red: crimson;
 *  color: var(--color-red);
 * }
 * ```
 *
 * Will result in:
 *
 * ```css
 * :root {
 *   --a: red;
 *   --b: blue;
 * }
 *
 * p {
 *   background-color: var(--b);
 *   color: var(--a);
 * }
 *
 * div {
 *   --a: crimson;
 *  color: var(--a);
 * }
 * ```
 *
 * If a prefix of "var-" is used and the name "a" is reserved, the resulting CSS
 * will instead be:
 *
 * ```css
 * :root {
 *   --var-b: red;
 *   --var-c: blue;
 * }
 *
 * p {
 *   background-color: var(--var-c);
 *   color: var(--var-b);
 * }
 *
 * div {
 *   --var-b: crimson;
 *  color: var(--var-b);
 * }
 * ```
 *
 * @since v0.1.0
 * @version v0.1.23
 */
class CssVariableMangler extends SimpleManglerPlugin {
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
}

export default CssVariableMangler;
