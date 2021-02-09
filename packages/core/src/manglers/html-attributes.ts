import type { CharSet } from "../types";

import { ALL_LOWERCASE_CHARS, ALL_NUMBER_CHARS } from "../characters";
import SimpleManglerPlugin from "./utils/simple-mangler.class";

/**
 * The options for _WebMangler_'s built-in HTML Attributes mangler.
 *
 * @since v0.1.0
 */
export type HtmlAttributeManglerOptions = {
  /**
   * One or more patterns for HTML attributes that should be mangled.
   *
   * The most common value for this option is: `'data-[a-z-]+'`,  which will
   * mangle all `data-` attributes.
   *
   * @default `"data-[a-z-]+"`
   * @since v0.1.0
   */
  attrNamePattern?: string | string[];

  /**
   * A list of strings and patterns of HTML attributes names that should not be
   * used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedAttrNames?: string[];

  /**
   * A prefix to use for mangled HTML attributes. Set to `''` if no prefix
   * should be used for mangled HTML attributes.
   *
   * The most common value for this option is: `'data-`, which will keep the
   * prefix of 'data-' attributes.
   *
   * @default `"data-"`
   * @since v0.1.0
   */
  keepAttrPrefix?: string;
}

/**
 * The HTML attribute mangler is a built-in plugin of _WebMangler_ that can be
 * used to mangle HTML attributes, e.g. "data-foo" in `<img data-foo="bar"/>`.
 *
 * This mangler can be configured using the {@link HtmlAttributeManglerOptions}.
 *
 * The simplest way to configure this mangler is by specifying a single pattern
 * of HTML attributes to mangle, e.g. all "data-" attributes:
 *
 * ```javascript
 * new HtmlAttributeMangler({ attrNamePattern: "data-[a-zA-Z-]+" });
 * ```
 *
 * For more fine-grained control or easier-to-read patterns, you can specify
 * multiple patterns. For example, to mangle only the "data-" attributes for
 * names and ages (provided you consistently prefix those attributes with
 * "data-name" and "data-age" resp.), you can use:
 *
 * ```javascript
 * new HtmlAttributeMangler({
 *   attrNamePattern: ["data-name[a-z-]+", "data-age[a-z-]+"],
 * });
 *
 * // Which is equivalent to:
 * new HtmlAttributeMangler({ attrNamePattern: "data-(name|font)[a-z-]+" });
 * ```
 *
 * If you don't specify any patterns the {@link HtmlAttributeMangler.
 * DEFAULT_PATTERNS} will be used, which will mangle all "data-" attributes.
 *
 * ## Examples
 *
 * _The following examples assume the usage of the built-in language plugins._
 *
 * ### HTML
 *
 * Using the default configuration (`new HtmlAttributeMangler()`) on the HTML:
 *
 * ```html
 * <div class="container">
 *   <p class="text">Hello <span data-name="John"></span></p>
 *    <a data-link-type="outgoing" href="https://www.example.com">Visit our website</a>
 * </div>
 * ```
 *
 * Will result in:
 *
 * ```html
 * <div class="container">
 *   <p class="text">Hello <span data-a="John"></span></p>
 *    <a data-b="outgoing" href="https://www.example.com">Visit our website</a>
 * </div>
 * ```
 *
 * If a prefix of "attr-" is used and the name "a" is reserved, the resulting
 * HTML will instead be:
 *
 * ```css
 * <div class="container">
 *   <p class="text">Hello <span attr-b="John"></span></p>
 *    <a attr-c="outgoing" href="https://www.example.com">Visit our website</a>
 * </div>
 * ```
 *
 * ### CSS
 *
 * Using the default configuration (`new HtmlAttributeMangler()`) on the CSS:
 *
 * ```css
 * span[data-name] { }
 * a[data-link-type="outgoing"] { }
 *
 * .data-name { }
 * #data-link-type { }
 * ```
 *
 * Will result in:
 *
 * ```css
 * span[data-a] { }
 * a[data-b="outgoing"] { }
 *
 * .data-name { }
 * #data-link-type { }
 * ```
 *
 * ### JavaScript
 *
 * Using the default configuration (`new HtmlIdMangler()`) on the JavaScript:
 *
 * ```javascript
 * document.querySelector("span[data-name]");
 * document.querySelector("a[data-link-type]");
 * ```
 *
 * Will result in:
 *
 * ```javascript
 * document.querySelector("span[data-a]");
 * document.querySelector("a[data-b]");
 * ```
 *
 * @since v0.1.0
 */
export default class HtmlAttributeMangler extends SimpleManglerPlugin {
  /**
   * The identifier of the {@link HtmlAttributeMangler} {@link
   * WebManglerPlugin}.
   */
  static readonly _ID = "html-attribute-mangler";

  /**
   * The list of reserved strings that are always reserved because they are
   * illegal HTML attribute names.
   *
   * @since v0.1.7
   */
  static readonly ALWAYS_RESERVED: string[] = ["([0-9]|-|_).*"];

  /**
   * The character set used by {@link HtmlAttributeMangler}. Note that HTML
   * attributes are case insensitive, so only lowercase letters are used.
   *
   * @since v0.1.7
   */
  static readonly CHARACTER_SET: CharSet = [
    ...ALL_LOWERCASE_CHARS,
    ...ALL_NUMBER_CHARS,
    "-", "_",
  ];

  /**
   * The default patterns used by a {@link HtmlAttributeMangler}.
   *
   * @since v0.1.0
   */
  static readonly DEFAULT_PATTERNS: string[] = ["data-[a-z-]+"];

  /**
   * The default prefix used by a {@link HtmlAttributeMangler}.
   *
   * @since v0.1.0
   */
  static readonly DEFAULT_PREFIX = "data-";

  /**
   * The default reserved names used by a {@link HtmlAttributeMangler}.
   *
   * @since v0.1.0
   */
  static readonly DEFAULT_RESERVED: string[] = [];

  /**
   * Instantiate a new {@link HtmlAttributeMangler}.
   *
   * @param options The {@link HtmlAttributeManglerOptions}.
   * @since v0.1.0
   */
  constructor(options: HtmlAttributeManglerOptions={}) {
    super(HtmlAttributeMangler._ID, {
      charSet: HtmlAttributeMangler.CHARACTER_SET,
      patterns: HtmlAttributeMangler.getPatterns(options.attrNamePattern),
      reserved: HtmlAttributeMangler.getReserved(options.reservedAttrNames),
      prefix: HtmlAttributeMangler.getPrefix(options.keepAttrPrefix),
    });
  }

  /**
   * Get either the configured patterns or the default patterns.
   *
   * @param attrNamePattern The configured patterns.
   * @returns The patterns to be used.
   */
  private static getPatterns(
    attrNamePattern?: string | string[],
  ): string | string[] {
    return attrNamePattern || HtmlAttributeMangler.DEFAULT_PATTERNS;
  }

  /**
   * Get either the configured reserved names or the default reserved names.
   *
   * @param reservedAttrNames The configured reserved names.
   * @returns The reserved names to be used.
   */
  private static getReserved(reservedAttrNames?: string[]): string[] {
    let configured = reservedAttrNames;
    if (configured === undefined) {
      configured = HtmlAttributeMangler.DEFAULT_RESERVED;
    }

    return HtmlAttributeMangler.ALWAYS_RESERVED.concat(configured);
  }

  /**
   * Get either the configured prefix or the default prefix.
   *
   * @param keepAttrPrefix The configured prefix.
   * @returns The prefix to be used.
   */
  private static getPrefix(keepAttrPrefix?: string): string {
    return keepAttrPrefix || HtmlAttributeMangler.DEFAULT_PREFIX;
  }
}
