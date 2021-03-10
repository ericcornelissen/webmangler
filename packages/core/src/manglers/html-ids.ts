import type { CharSet } from "../characters";
import type {
  QuerySelectorOptions,
  SingleValueAttributeOptions,
} from "../languages/options";
import type { MangleExpressionOptions } from "../types";

import { ALL_LETTER_CHARS, ALL_NUMBER_CHARS } from "../characters";
import { SimpleManglerPlugin } from "./utils";

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
 * @version v0.1.15
 */
export type HtmlIdManglerOptions = {
  /**
   * One or more patterns for IDs that should be mangled.
   *
   * @default `"id-[a-zA-Z-_]+"`
   * @since v0.1.0
   */
  idNamePattern?: string | string[];

  /**
   * A list of strings and patterns of IDs that should not be used.
   *
   * Patterns are supported since v0.1.7.
   *
   * @default `[]`
   * @since v0.1.0
   */
  reservedIds?: string[];

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
   * be specified.
   *
   * @default `[]`
   * @since v0.1.15
   */
  idAttributes?: string[];

  /**
   * A list of HTML attributes whose value to treat as a URI. That is, the ID
   * fragment of URIs in these attributes will be mangled if it is an internal
   * URI.
   *
   * NOTE: the `href` attribute is always included and does not need to be
   * specified.
   *
   * @default `[]`
   * @since v0.1.15
   */
  uriAttributes?: string[];
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
 * @version v0.1.15
 */
export default class HtmlIdMangler extends SimpleManglerPlugin {
  /**
   * The identifier of the {@link HtmlIdMangler} {@link WebManglerPlugin}.
   *
   * @since v0.1.0
   * @deprecated
   */
  static readonly _ID = "html-id-mangler";

  /**
   * The character set used by {@link HtmlIdMangler}.
   *
   * @since v0.1.7
   * @deprecated
   */
  static readonly CHARACTER_SET: CharSet = [
    ...ALL_LETTER_CHARS,
    ...ALL_NUMBER_CHARS,
    "-", "_",
  ];

  /**
   * The default patterns used by a {@link HtmlIdMangler}.
   *
   * @since v0.1.0
   * @deprecated
   */
  static readonly DEFAULT_PATTERNS: string[] = ["id-[a-zA-Z-_]+"];

  /**
   * The default prefix used by a {@link HtmlIdMangler}.
   *
   * @since v0.1.0
   * @deprecated
   */
  static readonly DEFAULT_PREFIX = "";

  /**
   * The default reserved names used by a {@link HtmlIdMangler}.
   *
   * @since v0.1.0
   * @deprecated
   */
  static readonly DEFAULT_RESERVED: string[] = [];

  /**
   * Instantiate a new {@link HtmlIdMangler}.
   *
   * @param options The {@link HtmlIdManglerOptions}.
   * @since v0.1.0
   */
  constructor(options: HtmlIdManglerOptions={}) {
    super({
      charSet: HtmlIdMangler.CHARACTER_SET,
      patterns: HtmlIdMangler.getPatterns(options.idNamePattern),
      reserved: HtmlIdMangler.getReserved(options.reservedIds),
      prefix: HtmlIdMangler.getPrefix(options.keepIdPrefix),
      expressionOptions: [
        QUERY_SELECTOR_EXPRESSION_OPTIONS,
        HtmlIdMangler.getIdAttributeExpressionOptions(options.idAttributes),
        HtmlIdMangler.getUriAttributeExpressionOptions(options.uriAttributes),
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
    idNamePattern?: string | string[],
  ): string | string[] {
    if (idNamePattern === undefined) {
      return HtmlIdMangler.DEFAULT_PATTERNS;
    }

    return idNamePattern;
  }

  /**
   * Get either the configured reserved names or the default reserved names.
   *
   * @param reservedIds The configured reserved names.
   * @returns The reserved names to be used.
   */
  private static getReserved(reservedIds?: string[]): string[] {
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
   * NOTE: duplicates are automatically removed.
   *
   * @param attributes The attributes to treat as `id`s.
   * @returns The {@link SingleValueAttributeOptions}.
   */
  private static getIdAttributeExpressionOptions(
    attributes?: string[],
  ): MangleExpressionOptions<SingleValueAttributeOptions> {
    const always: string[] = ["id", "for"];
    const configured = attributes?.filter((attr) => !always.includes(attr));

    return {
      name: "single-value-attributes",
      options: {
        attributeNames: [
          ...always,
          ...(configured || []),
        ],
      },
    };
  }

  /**
   * Get the {@link MangleExpressionOptions} for mangling URI attributes. The
   * `href` attribute is always included.
   *
   * NOTE: duplicates are automatically removed.
   *
   * @param attributes The attributes to treat as URIs.
   * @returns The {@link SingleValueAttributeOptions}.
   */
  private static getUriAttributeExpressionOptions(
    attributes?: string[],
  ): MangleExpressionOptions<SingleValueAttributeOptions> {
    const URI_BASE_PATTERN = "[a-zA-Z0-9\\-\\_\\/\\.]*#";
    const URI_QUERY_PATTERN = "(\\?[a-zA-Z0-9\\_\\-\\=\\%]+)?";

    const always: string[] = ["href"];
    const configured = attributes?.filter((attr) => !always.includes(attr));

    return {
      name: "single-value-attributes",
      options: {
        attributeNames: [
          ...always,
          ...(configured || []),
        ],
        valuePrefix: URI_BASE_PATTERN,
        valueSuffix: URI_QUERY_PATTERN,
      },
    };
  }
}
