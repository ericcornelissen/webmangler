import type {
  BuiltInLanguagesOptions,
  WebManglerLanguagePluginClass,
} from "./types";

import CssLanguageSupport from "../css";
import HtmlLanguageSupport from "../html";
import JavaScriptLanguageSupport from "../javascript";
import BuiltInManglers, { injectDependencies } from "./class";

injectDependencies(
  CssLanguageSupport as WebManglerLanguagePluginClass,
  HtmlLanguageSupport as WebManglerLanguagePluginClass,
  JavaScriptLanguageSupport as WebManglerLanguagePluginClass,
);

export default BuiltInManglers;

export type { BuiltInLanguagesOptions };
