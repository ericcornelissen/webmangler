import type { Char } from "../types";

import SimpleManglerPlugin from "./utils/simple-mangler.class";

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
   * A list of CSS class names that should not be used.
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
 */
export default class CssClassMangler extends SimpleManglerPlugin {
  /**
   * The identifier of the {@link CssClassMangler} {@link WebManglerPlugin}.
   */
  static readonly _ID = "css-class-mangler";

  /**
   * The character set used by {@link CssClassMangler}.
   *
   * @since v0.1.7
   */
  static readonly CHARACTER_SET: Char[] = [
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
    "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
    "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
    "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7",
    "8", "9", "_",
  ];

  /**
   * The default patterns used by a {@link CssClassMangler}.
   *
   * @since v0.1.0
   */
  static readonly DEFAULT_PATTERNS: string[] = ["cls-[a-zA-Z-_]+"];

  /**
   * The default prefix used by a {@link CssClassMangler}.
   *
   * @since v0.1.0
   */
  static readonly DEFAULT_PREFIX = "";

  /**
   * The default reserved names used by a {@link CssClassMangler}.
   *
   * @since v0.1.0
   */
  static readonly DEFAULT_RESERVED: string[] = [];

  /**
   * Instantiate a new {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @since v0.1.0
   */
  constructor(options: CssClassManglerOptions={}) {
    super(CssClassMangler._ID, {
      charSet: CssClassMangler.CHARACTER_SET,
      patterns: CssClassMangler.getPatterns(options.classNamePattern),
      reserved: CssClassMangler.getReserved(options.reservedClassNames),
      prefix: CssClassMangler.getPrefix(options.keepClassNamePrefix),
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
    return classNamePattern || CssClassMangler.DEFAULT_PATTERNS;
  }

  /**
   * Get either the configured reserved names or the default reserved names.
   *
   * @param reservedClassNames The configured reserved names.
   * @returns The reserved names to be used.
   */
  private static getReserved(reservedClassNames?: string[]): string[] {
    return reservedClassNames || CssClassMangler.DEFAULT_RESERVED;
  }

  /**
   * Get either the configured prefix or the default prefix.
   *
   * @param keepClassNamePrefix The configured prefix.
   * @returns The prefix to be used.
   */
  private static getPrefix(keepClassNamePrefix?: string): string {
    return keepClassNamePrefix || CssClassMangler.DEFAULT_PREFIX;
  }
}
