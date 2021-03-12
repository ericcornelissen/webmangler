import type { CharSet } from "../characters";
import type {
  MultiValueAttributeOptions,
  QuerySelectorOptions,
} from "../languages/options";
import type { MangleExpressionOptions } from "../types";

import { ALL_LETTER_CHARS, ALL_NUMBER_CHARS } from "../characters";
import { SimpleManglerPlugin } from "./utils";

const QUERY_SELECTOR_EXPRESSION_OPTIONS:
    MangleExpressionOptions<QuerySelectorOptions> = {
  name: "query-selectors",
  options: {
    prefix: "\\.",
  },
};

const CLASS_ATTRIBUTE_EXPRESSION_OPTIONS:
    MangleExpressionOptions<MultiValueAttributeOptions> = {
  name: "multi-value-attributes",
  options: {
    attributeNames: ["class"],
  },
};

/**
 * The options for _WebMangler_'s built-in CSS class mangler.
 *
 * @since v0.1.0
 */
export type CssClassManglerOptions = {
  /**
   * One or more patterns for CSS classes that should be mangled.
   *
   * @default `"cls-[a-zA-Z-_]+"`
   * @since v0.1.0
   */
  classNamePattern?: string | string[];

  /**
   * A list of strings and patterns of CSS class names that should not be used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedClassNames?: string[];

  /**
   * A prefix to use for mangled CSS classes.
   *
   * @default `""`
   * @since v0.1.0
   */
  keepClassNamePrefix?: string;

  /**
   * A list of HTML attributes whose value to treat as `class`.
   *
   * NOTE: the `class` attribute is always included and does not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.16
   */
  classAttributes?: string[];
}

/**
 * The CSS class mangler is a built-in plugin of _WebMangler_ that can be used
 * to mangle CSS classes, e.g. "cls-foo" in `.cls-foo { color: red; }`.
 *
 * This mangler can be configured using the {@link CssClassManglerOptions}.
 *
 * The simplest way to configure this mangler is by specifying a single pattern
 * of CSS classes to mangle, e.g. all CSS classes:
 *
 * ```javascript
 * new CssClassMangler({ classNamePattern: "[a-zA-Z-_]+" });
 * ```
 *
 * For more fine-grained control or easier-to-read patterns, you can specify
 * multiple patterns. For example, to mangle only the CSS classes with the
 * prefix "header" or "footer" you can use:
 *
 * ```javascript
 * new CssClassMangler({
 *   classNamePattern: ["header[-_][a-z]+", "footer[-_][a-z]+"],
 * });
 *
 * // Which is equivalent to:
 * new CssClassMangler({ classNamePattern: "(header|footer)[-_][a-z]+" });
 * ```
 *
 * If you don't specify any patterns the {@link CssClassMangler.
 * DEFAULT_PATTERNS} will be used.
 *
 * ## Examples
 *
 * _The following examples assume the usage of the built-in language plugins._
 *
 * ### CSS
 *
 * Using the default configuration (`new CssClassMangler()`) on the CSS:
 *
 * ```css
 * .cls-foo { }
 * .cls-bar { }
 * #cls-bar > .cls-foo { }
 * .foobar { }
 * ```
 *
 * Will result in:
 *
 * ```css
 * .a { }
 * .b { }
 * #cls-bar > .a { }
 * .foobar { }
 * ```
 *
 * If a prefix of "cls-" is used and the name "a" is reserved, the resulting CSS
 * will instead be:
 *
 * ```css
 * .cls-a { }
 * .cls-b { }
 * #cls-bar > .cls-a { }
 * .foobar { }
 * ```
 *
 * ### HTML
 *
 * Using the default configuration (`new CssClassMangler()`) on the HTML:
 *
 * ```html
 * <div id="cls-bar" class="cls-foo">
 *   <div class="foobar cls-bar"></div>
 * </div>
 * ```
 *
 * Will result in:
 *
 * ```html
 * <div id="cls-bar" class="a">
 *   <div class="foobar b"></div>
 * </div>
 * ```
 *
 * ### JavaScript
 *
 * Using the default configuration (`new CssClassMangler()`) on the JavaScript:
 *
 * ```javascript
 * document.querySelector(".cls-foo");
 * $el.classList.add("cls-bar");
 * ```
 *
 * Will result in:
 *
 * ```javascript
 * document.querySelector(".a");
 * $el.classList.add("b");
 * ```
 *
 * @since v0.1.0
 * @version v0.1.16
 */
export default class CssClassMangler extends SimpleManglerPlugin {
  /**
   * The list of reserved strings that are always reserved because they are
   * illegal class names.
   */
  private static readonly ALWAYS_RESERVED: string[] = ["(-|[0-9]).*"];

  /**
   * The character set used by {@link CssClassMangler}.
   */
  private static readonly CHARACTER_SET: CharSet = [
    ...ALL_LETTER_CHARS,
    ...ALL_NUMBER_CHARS,
    "-", "_",
  ];

  /**
   * The default patterns used by a {@link CssClassMangler}.
   */
  private static readonly DEFAULT_PATTERNS: string[] = ["cls-[a-zA-Z-_]+"];

  /**
   * The default prefix used by a {@link CssClassMangler}.
   */
  private static readonly DEFAULT_PREFIX = "";

  /**
   * The default reserved names used by a {@link CssClassMangler}.
   */
  private static readonly DEFAULT_RESERVED: string[] = [];

  /**
   * Instantiate a new {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @since v0.1.0
   */
  constructor(options: CssClassManglerOptions={}) {
    super({
      charSet: CssClassMangler.CHARACTER_SET,
      patterns: CssClassMangler.getPatterns(options.classNamePattern),
      reserved: CssClassMangler.getReserved(options.reservedClassNames),
      prefix: CssClassMangler.getPrefix(options.keepClassNamePrefix),
      expressionOptions: [
        QUERY_SELECTOR_EXPRESSION_OPTIONS,
        CLASS_ATTRIBUTE_EXPRESSION_OPTIONS,
      ],
    });
  }

  /**
   * Get either the configured patterns or the default patterns.
   *
   * @param classNamePattern The configured patterns.
   * @returns The patterns to be used.
   */
  private static getPatterns(
    classNamePattern?: string | string[],
  ): string | string[] {
    if (classNamePattern === undefined) {
      return CssClassMangler.DEFAULT_PATTERNS;
    }

    return classNamePattern;
  }

  /**
   * Get either the configured reserved names or the default reserved names.
   *
   * @param reservedClassNames The configured reserved names.
   * @returns The reserved names to be used.
   */
  private static getReserved(reservedClassNames?: string[]): string[] {
    let configured = reservedClassNames;
    if (configured === undefined) {
      configured = CssClassMangler.DEFAULT_RESERVED;
    }

    return CssClassMangler.ALWAYS_RESERVED.concat(configured);
  }

  /**
   * Get either the configured prefix or the default prefix.
   *
   * @param keepClassNamePrefix The configured prefix.
   * @returns The prefix to be used.
   */
  private static getPrefix(keepClassNamePrefix?: string): string {
    if (keepClassNamePrefix === undefined) {
      return CssClassMangler.DEFAULT_PREFIX;
    }

    return keepClassNamePrefix;
  }
}
