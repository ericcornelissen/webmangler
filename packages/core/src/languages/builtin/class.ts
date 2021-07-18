import type {
  BuiltInLanguagesOptions,
  WebManglerLanguagePluginClass,
} from "./types";

import { MultiLanguagePlugin } from "@webmangler/language-utils";

let CssLanguageSupport: WebManglerLanguagePluginClass;
let HtmlLanguageSupport: WebManglerLanguagePluginClass;
let JavaScriptLanguageSupport: WebManglerLanguagePluginClass;

/**
 * Inject the {@link WebManglerLanguagePlugin}s used in the
 * {@link BuiltInLanguagesPlugin}.
 *
 * @param _CssLanguageSupport The CSS {@link WebManglerLanguagePlugin}.
 * @param _HtmlLanguageSupport The HTML {@link WebManglerLanguagePlugin}.
 * @param _JavaScriptLanguageSupport The JS {@link WebManglerLanguagePlugin}.
 */
export function injectDependencies(
  _CssLanguageSupport: WebManglerLanguagePluginClass,
  _HtmlLanguageSupport: WebManglerLanguagePluginClass,
  _JavaScriptLanguageSupport: WebManglerLanguagePluginClass,
): void {
  CssLanguageSupport = _CssLanguageSupport;
  HtmlLanguageSupport = _HtmlLanguageSupport;
  JavaScriptLanguageSupport = _JavaScriptLanguageSupport;
}

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
