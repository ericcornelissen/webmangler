import type { CharSet } from "../characters";
import type {
  QuerySelectorOptions,
  SingleValueAttributeOptions,
} from "../languages/options";
import type { MangleExpressionOptions } from "../types";

import { SimpleManglerPlugin } from "@webmangler/mangler-utils";

import { ALL_LETTER_CHARS, ALL_NUMBER_CHARS } from "../characters";

const QUERY_SELECTOR_EXPRESSION_OPTIONS:
    MangleExpressionOptions<QuerySelectorOptions> = {
  name: "query-selectors",
  options: {
    prefix: "#",
  },
};

/**
 * The options for _WebMangler_'s built-in HTML IDs mangler.
 *
 * @since v0.1.0
 * @version v0.1.23
 */
export type HtmlIdManglerOptions = {
  /**
   * One or more patterns for IDs that should be mangled.
   *
   * @default `"id-[a-zA-Z-_]+"`
   * @since v0.1.0
   * @version v0.1.17
   */
  idNamePattern?: string | Iterable<string>;

  /**
   * One or more patterns for CSS classes that should **never** be mangled.
   *
   * @default `[]`
   * @version v0.1.23
   */
  ignoreIdNamePattern?: string | Iterable<string>;

  /**
   * A list of strings and patterns of IDs that should not be used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   * @version v0.1.17
   */
  reservedIds?: Iterable<string>;

  /**
   * A prefix to use for mangled IDs.
   *
   * @default `""`
   * @since v0.1.0
   */
  keepIdPrefix?: string;

  /**
   * A list of HTML attributes whose value to treat as an `id`.
   *
   * NOTE: the `id` and `for` attributes are always included and do not need to
   * be specified when using this option.
   *
   * @default `[]`
   * @since v0.1.15
   * @version v0.1.17
   */
  idAttributes?: Iterable<string>;

  /**
   * A list of HTML attributes whose value to treat as a URL. That is, the ID
   * fragment of URLs in these attributes will be mangled if it is an internal
   * URL.
   *
   * NOTE: the `href` attribute is always included and does not need to be
   * specified when using this option.
   *
   * @default `[]`
   * @since v0.1.15
   * @version v0.1.17
   */
  urlAttributes?: Iterable<string>;
}

/**
 * The HTML ID mangler (or just ID mangler) is a built-in plugin of _WebMangler_
 * that can be used to mangle IDs on the web, e.g. in `<div id="foo"></div>`.
 *
 * This mangler can be configured using the {@link HtmlIdManglerOptions}.
 *
 * The simplest way to configure this mangler is by specifying a single pattern
 * of IDs to mangle, e.g. all IDs:
 *
 * ```javascript
 * new HtmlIdMangler({ idNamePattern: "[a-zA-Z-]+" });
 * ```
 *
 * For more fine-grained control or easier-to-read patterns, you can specify
 * multiple patterns. For example, to mangle only the IDs of images and inputs
 * (provided you consistently prefix their IDs with "img" and "inp" resp.), you
 * can use:
 *
 * ```javascript
 * new HtmlIdMangler({ idNamePattern: ["img-[a-z]+", "inp-[a-z]+"] });
 *
 * // Which is equivalent to:
 * new HtmlIdMangler({ idNamePattern: "(img|inp)-[a-z]+" });
 * ```
 *
 * If you don't specify any patterns the {@link HtmlIdMangler.DEFAULT_PATTERNS}
 * will be used.
 *
 * ## Examples
 *
 * _The following examples assume the usage of the built-in language plugins._
 *
 * ### HTML
 *
 * Using the default configuration (`new HtmlIdMangler()`) on the HTML:
 *
 * ```html
 * <div id="id-my-div">
 *   <h2 id="section-header">Blog title</h2>
 *   <p id="id-blog-text">Lorem ipsum dolor...</p>
 * </div>
 * ```
 *
 * Will result in:
 *
 * ```html
 * <div id="a">
 *   <h2 id="section-header">Blog title</h2>
 *   <p id="b">Lorem ipsum dolor...</p>
 * </div>
 * ```
 *
 * If a prefix of "mangled-" is used and the name "a" is reserved, the resulting
 * HTML will instead be:
 *
 * ```html
 * <div id="mangled-b">
 *   <h2 id="section-header">Blog title</h2>
 *   <p id="mangled-c">Lorem ipsum dolor...</p>
 * </div>
 * ```
 *
 * ### CSS
 *
 * Using the default configuration (`new HtmlIdMangler()`) on the CSS:
 *
 * ```css
 * #id-foo { }
 * #foobar { }
 * #id-bar { }
 * .id-class { }
 * ```
 *
 * Will result in:
 *
 * ```css
 * #a { }
 * #foobar { }
 * #b { }
 * .id-class { }
 * ```
 *
 * ### JavaScript
 *
 * Using the default configuration (`new HtmlIdMangler()`) on the JavaScript:
 *
 * ```javascript
 * document.getElementById("id-foo");
 * document.querySelector("#id-bar");
 * ```
 *
 * Will result in:
 *
 * ```javascript
 * document.getElementById("a");
 * document.querySelector("#b");
 * ```
 *
 * @since v0.1.0
 * @version v0.1.23
 */
export default class HtmlIdMangler extends SimpleManglerPlugin {
  /**
   * The character set used by {@link HtmlIdMangler}.
   */
  private static readonly CHARACTER_SET: CharSet = [
    ...ALL_LETTER_CHARS,
    ...ALL_NUMBER_CHARS,
    "-", "_",
  ];

  /**
   * The default ignore patterns used by a {@link HtmlIdMangler}.
   */
  private static readonly DEFAULT_IGNORE_PATTERNS: string[] = [];

  /**
   * The default patterns used by a {@link HtmlIdMangler}.
   */
  private static readonly DEFAULT_PATTERNS: string[] = ["id-[a-zA-Z-_]+"];

  /**
   * The default prefix used by a {@link HtmlIdMangler}.
   */
  private static readonly DEFAULT_PREFIX = "";

  /**
   * The default reserved names used by a {@link HtmlIdMangler}.
   */
  private static readonly DEFAULT_RESERVED: string[] = [];

  /**
   * A list of the attributes always treated as `id` by {@link HtmlIdMangler}.
   */
  private static readonly STANDARD_ID_ATTRIBUTES: string[] = ["id", "for"];

  /**
   * A list of the attributes always treated as URL by {@link HtmlIdMangler}.
   */
  private static readonly STANDARD_URL_ATTRIBUTES: string[] = ["href"];

  /**
   * Instantiate a new {@link HtmlIdMangler}.
   *
   * @param options The {@link HtmlIdManglerOptions}.
   * @since v0.1.0
   * @version v0.1.23
   */
  constructor(options: HtmlIdManglerOptions={}) {
    super({
      charSet: HtmlIdMangler.CHARACTER_SET,
      patterns: HtmlIdMangler.getPatterns(options.idNamePattern),
      ignorePatterns: HtmlIdMangler.getIgnorePatterns(
        options.ignoreIdNamePattern,
      ),
      reserved: HtmlIdMangler.getReserved(options.reservedIds),
      prefix: HtmlIdMangler.getPrefix(options.keepIdPrefix),
      languageOptions: [
        QUERY_SELECTOR_EXPRESSION_OPTIONS,
        HtmlIdMangler.getIdAttributeExpressionOptions(options.idAttributes),
        HtmlIdMangler.getUrlAttributeExpressionOptions(options.urlAttributes),
      ],
    });
  }

  /**
   * Get either the configured patterns or the default patterns.
   *
   * @param idNamePattern The configured patterns.
   * @returns The patterns to be used.
   */
  private static getPatterns(
    idNamePattern?: string | Iterable<string>,
  ): string | Iterable<string> {
    if (idNamePattern === undefined) {
      return HtmlIdMangler.DEFAULT_PATTERNS;
    }

    return idNamePattern;
  }

  /**
   * Get either the configured patterns or the default patterns.
   *
   * @param ignoreIdNamePattern The configured ignore patterns.
   * @returns The ignore patterns to be used.
   */
  private static getIgnorePatterns(
    ignoreIdNamePattern?: string | Iterable<string>,
  ): string | Iterable<string> {
    if (ignoreIdNamePattern === undefined) {
      return HtmlIdMangler.DEFAULT_IGNORE_PATTERNS;
    }

    return ignoreIdNamePattern;
  }

  /**
   * Get either the configured reserved names or the default reserved names.
   *
   * @param reservedIds The configured reserved names.
   * @returns The reserved names to be used.
   */
  private static getReserved(reservedIds?: Iterable<string>): Iterable<string> {
    if (reservedIds === undefined) {
      return HtmlIdMangler.DEFAULT_RESERVED;
    }

    return reservedIds;
  }

  /**
   * Get either the configured prefix or the default prefix.
   *
   * @param keepIdPrefix The configured prefix.
   * @returns The prefix to be used.
   */
  private static getPrefix(keepIdPrefix?: string): string {
    if (keepIdPrefix === undefined) {
      return HtmlIdMangler.DEFAULT_PREFIX;
    }

    return keepIdPrefix;
  }

  /**
   * Get the {@link MangleExpressionOptions} for mangling id-like attributes.
   * The `id` and `for` attributes are always included.
   *
   * @param attributes The attributes to treat as `id`s.
   * @returns The {@link SingleValueAttributeOptions}.
   */
  private static getIdAttributeExpressionOptions(
    attributes: Iterable<string> = [],
  ): MangleExpressionOptions<SingleValueAttributeOptions> {
    return {
      name: "single-value-attributes",
      options: {
        attributeNames: new Set([
          ...HtmlIdMangler.STANDARD_ID_ATTRIBUTES,
          ...attributes,
        ]),
      },
    };
  }

  /**
   * Get the {@link MangleExpressionOptions} for mangling URL attributes. The
   * `href` attribute is always included.
   *
   * @param attributes The attributes to treat as URLs.
   * @returns The {@link SingleValueAttributeOptions}.
   */
  private static getUrlAttributeExpressionOptions(
    attributes: Iterable<string> = [],
  ): MangleExpressionOptions<SingleValueAttributeOptions> {
    return {
      name: "single-value-attributes",
      options: {
        attributeNames: new Set([
          ...HtmlIdMangler.STANDARD_URL_ATTRIBUTES,
          ...attributes,
        ]),
        valuePrefix: "[a-zA-Z0-9\\-\\_\\/\\.\\?]*(\\?[a-zA-Z0-9\\_\\-\\=\\%]+)?#",
      },
    };
  }
}
