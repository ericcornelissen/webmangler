import type { CssVariableManglerOptions } from "./types";

import initCssVariableMangler from "./class";
import * as helpers from "./helpers";

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
const CssVariableMangler = initCssVariableMangler(helpers);

export default CssVariableMangler;

export type {
  CssVariableManglerOptions,
};
