import MultiLanguagePlugin from "../utils/multi-language-plugin.class";

import CssLanguageSupport from "../css";
import HtmlLanguageSupport from "../html";
import JavaScriptLanguageSupport from "../javascript";

/**
 * This {@link WebManglerLanguagePlugin} enables all built-in language plugins.
 *
 * @since v0.1.0
 */
export default class BuiltInLanguagesPlugin extends MultiLanguagePlugin {
  /**
   * Instantiate a new {@link BuiltInLanguagesPlugin}.
   */
  constructor() {
    super([
      new CssLanguageSupport(),
      new HtmlLanguageSupport(),
      new JavaScriptLanguageSupport(),
    ]);
  }
}
