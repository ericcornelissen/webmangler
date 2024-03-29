import type { CssLanguagePluginOptions } from "@webmangler/language-css";
import type { HtmlLanguagePluginOptions } from "@webmangler/language-html";
import type { JavaScriptLanguagePluginOptions } from "@webmangler/language-js";
import type { WebManglerLanguagePlugin } from "@webmangler/types";

/**
 * The configuration of the {@link BuiltInLanguagesPlugin}.
 *
 * @since v0.1.21
 */
interface BuiltInLanguagesOptions extends
  CssLanguagePluginOptions,
  HtmlLanguagePluginOptions,
  JavaScriptLanguagePluginOptions { }

/**
 * Type of the constructor of a {@link WebManglerLanguagePlugin}.
 */
type WebManglerLanguagePluginClass = {
  new(options?: unknown): WebManglerLanguagePlugin;
};

export type {
  BuiltInLanguagesOptions,
  WebManglerLanguagePluginClass,
};
