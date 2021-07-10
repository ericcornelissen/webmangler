import type { RecommendedManglersOptions, WebManglerPluginClass } from "./types";

import RecommendedManglers, { injectDependencies } from "./class";
import CssClassMangler from "../css-classes";
import CssVariableMangler from "../css-variables";
import HtmlAttributeMangler from "../html-attributes";

injectDependencies(
  CssClassMangler as WebManglerPluginClass,
  CssVariableMangler as WebManglerPluginClass,
  HtmlAttributeMangler as WebManglerPluginClass,
);

export default RecommendedManglers;

export type { RecommendedManglersOptions };
