import type { HtmlIdManglerOptions } from "./types";

import { SimpleManglerPlugin } from "@webmangler/mangler-utils";

import * as helpers from "./helpers";

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
class HtmlIdMangler extends SimpleManglerPlugin {
  /**
   * Instantiate a new {@link HtmlIdMangler}.
   *
   * @param options The {@link HtmlIdManglerOptions}.
   * @since v0.1.0
   * @version v0.1.23
   */
  constructor(options: HtmlIdManglerOptions={}) {
    super({
      charSet: helpers.getCharacterSet(),
      patterns: helpers.getPatterns(options),
      ignorePatterns: helpers.getIgnorePatterns(options),
      reserved: helpers.getReserved(options),
      prefix: helpers.getPrefix(options),
      languageOptions: helpers.getLanguageOptions(options),
    });
  }
}

export default HtmlIdMangler;
