import type { CharSet } from "../characters";
import type {
  CssDeclarationPropertyOptions,
  CssDeclarationValueOptions,
} from "../languages/options";
import type { MangleExpressionOptions } from "../types";

import { ALL_LETTER_CHARS, ALL_NUMBER_CHARS } from "../characters";
import { SimpleManglerPlugin } from "./utils";

const CSS_VARIABLE_DECLARATION_EXPRESSION_OPTIONS:
    MangleExpressionOptions<CssDeclarationPropertyOptions> = {
  name: "css-declaration-properties",
  options: {
    prefix: "--",
  },
};

const CSS_VARIABLE_USAGE_EXPRESSION_OPTIONS:
    MangleExpressionOptions<CssDeclarationValueOptions> = {
  name: "css-declaration-values",
  options: {
    prefix: "var\\s*\\(\\s*--",
    suffix: "\\s*(,[^\\)]+)?\\)",
  },
};

/**
 * The options for _WebMangler_'s built-in CSS variables mangler.
 *
 * @since v0.1.0
 * @version v0.1.23
 */
export type CssVariableManglerOptions = {
  /**
   * One or more patterns for CSS variables that should be mangled.
   *
   * @default `"[a-zA-Z-]+"`
   * @since v0.1.0
   * @version v0.1.17
   */
  cssVarNamePattern?: string | Iterable<string>;

  /**
   * One or more patterns for CSS variables that should **never** be mangled.
   *
   * @default `[]`
   * @version v0.1.23
   */
  ignoreCssVarNamePattern?: string | Iterable<string>;

  /**
   * A list of strings and patterns of CSS variable names that should not be
   * used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   * @version v0.1.17
   */
  reservedCssVarNames?: Iterable<string>;

  /**
   * A prefix to use for mangled CSS variables.
   *
   * @default `""`
   * @since v0.1.0
   */
  keepCssVarPrefix?: string;
}

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
export default class CssVariableMangler extends SimpleManglerPlugin {
  /**
   * The list of reserved strings that are always reserved because they are
   * illegal CSS variable names.
   */
  private static readonly ALWAYS_RESERVED: string[] = ["([0-9]|-).*"];

  /**
   * The character set used by {@link CssVariableMangler}.
   */
  private static readonly CHARACTER_SET: CharSet = [
    ...ALL_LETTER_CHARS,
    ...ALL_NUMBER_CHARS,
    "-", "_",
  ];

  /**
   * The default ignore patterns used by a {@link CssVariableMangler}.
   */
  private static readonly DEFAULT_IGNORE_PATTERNS: string[] = [];

  /**
   * The default patterns used by a {@link CssVariableMangler}.
   */
  private static readonly DEFAULT_PATTERNS: string[] = ["[a-zA-Z-]+"];

  /**
   * The default prefix used by a {@link CssVariableMangler}.
   */
  private static readonly DEFAULT_PREFIX = "";

  /**
   * The default reserved names used by a {@link CssVariableMangler}.
   */
  private static readonly DEFAULT_RESERVED: string[] = [];

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
      patterns: CssVariableMangler.getPatterns(options.cssVarNamePattern),
      ignorePatterns: CssVariableMangler.getIgnorePatterns(
        options.ignoreCssVarNamePattern,
      ),
      reserved: CssVariableMangler.getReserved(options.reservedCssVarNames),
      prefix: CssVariableMangler.getPrefix(options.keepCssVarPrefix),
      languageOptions: [
        CSS_VARIABLE_DECLARATION_EXPRESSION_OPTIONS,
        CSS_VARIABLE_USAGE_EXPRESSION_OPTIONS,
      ],
    });
  }

  /**
   * Get either the configured patterns or the default patterns.
   *
   * @param cssVarNamePattern The configured patterns.
   * @returns The patterns to be used.
   */
  private static getPatterns(
    cssVarNamePattern?: string | Iterable<string>,
  ): string | Iterable<string> {
    if (cssVarNamePattern === undefined) {
      return CssVariableMangler.DEFAULT_PATTERNS;
    }

    return cssVarNamePattern;
  }

  /**
   * Get either the configured patterns or the default patterns.
   *
   * @param ignoreCssVarNamePattern The configured ignore patterns.
   * @returns The ignore patterns to be used.
   */
  private static getIgnorePatterns(
    ignoreCssVarNamePattern?: string | Iterable<string>,
  ): string | Iterable<string> {
    if (ignoreCssVarNamePattern === undefined) {
      return CssVariableMangler.DEFAULT_IGNORE_PATTERNS;
    }

    return ignoreCssVarNamePattern;
  }

  /**
   * Get either the configured reserved names or the default reserved names.
   *
   * @param reservedCssVarNames The configured reserved names.
   * @returns The reserved names to be used.
   */
  private static getReserved(
    reservedCssVarNames?: Iterable<string>,
  ): Iterable<string> {
    let configured = reservedCssVarNames;
    if (configured === undefined) {
      configured = CssVariableMangler.DEFAULT_RESERVED;
    }

    return [
      ...CssVariableMangler.ALWAYS_RESERVED,
      ...configured,
    ];
  }

  /**
   * Get either the configured prefix or the default prefix.
   *
   * @param keepCssVarPrefix The configured prefix.
   * @returns The prefix to be used.
   */
  private static getPrefix(keepCssVarPrefix?: string): string {
    if (keepCssVarPrefix === undefined) {
      return CssVariableMangler.DEFAULT_PREFIX;
    }

    return keepCssVarPrefix;
  }
}
