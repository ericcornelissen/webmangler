import type { HtmlAttributeManglerOptions } from "./types";

import { SimpleManglerPlugin } from "@webmangler/mangler-utils";

import * as helpers from "./helpers";

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
 * @version v0.1.23
 */
class HtmlAttributeMangler extends SimpleManglerPlugin {
  /**
   * Instantiate a new {@link HtmlAttributeMangler}.
   *
   * @param options The {@link HtmlAttributeManglerOptions}.
   * @since v0.1.0
   * @version v0.1.23
   */
  constructor(options: HtmlAttributeManglerOptions={}) {
    super({
      charSet: helpers.getCharacterSet(),
      patterns: helpers.getPatterns(options.attrNamePattern),
      ignorePatterns: helpers.getIgnorePatterns(options.ignoreAttrNamePattern),
      reserved: helpers.getReserved(options.reservedAttrNames),
      prefix: helpers.getPrefix(options.keepAttrPrefix),
      languageOptions: helpers.getLanguageOptions(),
    });
  }
}

export default HtmlAttributeMangler;
