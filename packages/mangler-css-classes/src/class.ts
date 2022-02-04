import type { CssClassManglerOptions } from "./types";

import { SimpleManglerPlugin } from "@webmangler/mangler-utils";

import * as helpers from "./helpers";

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
   * Instantiate a new {@link CssClassMangler}.
   *
   * @param options The {@link CssClassManglerOptions}.
   * @since v0.1.0
   * @version v0.1.23
   */
  constructor(options: CssClassManglerOptions={}) {
    super({
      charSet: helpers.getCharacterSet(),
      patterns: helpers.getPatterns(options.classNamePattern),
      ignorePatterns: helpers.getIgnorePatterns(options.ignoreClassNamePattern),
      reserved: helpers.getReserved(options.reservedClassNames),
      prefix: helpers.getPrefix(options.keepClassNamePrefix),
      languageOptions: [
        helpers.getQuerySelectorExpressionOptions(),
        helpers.getClassAttributeExpressionOptions(options.classAttributes),
      ],
    });
  }
}

export default CssClassMangler;
