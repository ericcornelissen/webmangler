import type { WebManglerLanguagePlugin } from "../../types";
import type { CssLanguagePluginOptions } from "../css";
import type { HtmlLanguagePluginOptions } from "../html";
import type { JavaScriptLanguagePluginOptions } from "../javascript";

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
 * Type of the constructor of a {@link WebManglerLanguagePlugin}.
 */
export type WebManglerLanguagePluginClass = {
  new(options?: unknown): WebManglerLanguagePlugin;
};
