import type { CharSet, MangleExpressionOptions } from "@webmangler/types";

import type {
  CssClassManglerOptions,
  MultiValueAttributeOptions,
  QuerySelectorOptions,
} from "./types";

import { SimpleManglerPlugin } from "@webmangler/mangler-utils";

import { ALL_LETTER_CHARS, ALL_NUMBER_CHARS } from "./characters";

const QUERY_SELECTOR_EXPRESSION_OPTIONS:
    MangleExpressionOptions<QuerySelectorOptions> = {
  name: "query-selectors",
  options: {
    prefix: "\\.",
  },
};

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
 * @version v0.1.23
 */
class CssClassMangler extends SimpleManglerPlugin {
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
   * The default ignore patterns used by a {@link CssClassMangler}.
   */
  private static readonly DEFAULT_IGNORE_PATTERNS: string[] = [];

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
   * A list of the attributes always treated as `class` by {@link
   * CssClassMangler}s.
   */
  private static readonly STANDARD_CLASS_ATTRIBUTES: string[] = ["class"];

  /**
   * Instantiate a new {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @since v0.1.0
   * @version v0.1.23
   */
  constructor(options: CssClassManglerOptions={}) {
    super({
      charSet: CssClassMangler.CHARACTER_SET,
      patterns: CssClassMangler.getPatterns(options.classNamePattern),
      ignorePatterns: CssClassMangler.getIgnorePatterns(
        options.ignoreClassNamePattern,
      ),
      reserved: CssClassMangler.getReserved(options.reservedClassNames),
      prefix: CssClassMangler.getPrefix(options.keepClassNamePrefix),
      languageOptions: [
        QUERY_SELECTOR_EXPRESSION_OPTIONS,
        CssClassMangler.getClassAttributeExpressionOptions(
          options.classAttributes,
        ),
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
    classNamePattern?: string | Iterable<string>,
  ): string | Iterable<string> {
    if (classNamePattern === undefined) {
      return CssClassMangler.DEFAULT_PATTERNS;
    }

    return classNamePattern;
  }

  /**
   * Get either the configured patterns or the default patterns.
   *
   * @param ignoreClassNamePattern The configured ignore patterns.
   * @returns The ignore patterns to be used.
   */
  private static getIgnorePatterns(
    ignoreClassNamePattern?: string | Iterable<string>,
  ): string | Iterable<string> {
    if (ignoreClassNamePattern === undefined) {
      return CssClassMangler.DEFAULT_IGNORE_PATTERNS;
    }

    return ignoreClassNamePattern;
  }

  /**
   * Get either the configured reserved names or the default reserved names.
   *
   * @param reservedClassNames The configured reserved names.
   * @returns The reserved names to be used.
   */
  private static getReserved(
    reservedClassNames?: Iterable<string>,
  ): Iterable<string> {
    let configured = reservedClassNames;
    if (configured === undefined) {
      configured = CssClassMangler.DEFAULT_RESERVED;
    }

    return [
      ...CssClassMangler.ALWAYS_RESERVED,
      ...configured,
    ];
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

  /**
   * Get the {@link MangleExpressionOptions} for mangling class-like attributes.
   * The `class` attribute is always included.
   *
   * @param attributes The attributes to treat as `class`es.
   * @returns The {@link MangleExpressionOptions}.
   */
  private static getClassAttributeExpressionOptions(
    attributes: Iterable<string> = [],
  ): MangleExpressionOptions<MultiValueAttributeOptions> {
    return {
      name: "multi-value-attributes",
      options: {
        attributeNames: new Set([
          ...CssClassMangler.STANDARD_CLASS_ATTRIBUTES,
          ...attributes,
        ]),
      },
    };
  }
}

export default CssClassMangler;
