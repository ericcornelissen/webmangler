import type { CssLanguagePluginOptions } from "./css";
import type { HtmlLanguagePluginOptions } from "./html";
import type { JavaScriptLanguagePluginOptions } from "./javascript";

import { MultiLanguagePlugin } from "./utils";
import CssLanguageSupport from "./css";
import HtmlLanguageSupport from "./html";
import JavaScriptLanguageSupport from "./javascript";

/**
 * The configuration of the {@link BuiltInLanguagesPlugin}.
 *
 * @since v0.1.21
 */
export interface BuiltInLanguagesOptions extends
  CssLanguagePluginOptions,
  HtmlLanguagePluginOptions,
  JavaScriptLanguagePluginOptions { }

/**
 * This {@link WebManglerLanguagePlugin} enables all built-in language plugins.
 *
 * @since v0.1.0
 * @version v0.1.17
 */
export default class BuiltInLanguagesPlugin extends MultiLanguagePlugin {
  /**
   * Instantiate a new {@link BuiltInLanguagesPlugin}.
   *
   * @param [options] The {@link BuiltInLanguagesOptions}.
   * @since v0.1.0
   * @version v0.1.17
   */
  constructor(options: BuiltInLanguagesOptions={}) {
    super([
      new CssLanguageSupport(options),
      new HtmlLanguageSupport(options),
      new JavaScriptLanguageSupport(options),
    ]);
  }
}
