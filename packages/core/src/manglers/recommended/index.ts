import type { RecommendedManglersOptions, WebManglerPluginClass } from "./types";

import CssClassMangler from "@webmangler/mangler-css-classes";
import CssVariableMangler from "@webmangler/mangler-css-variables";
import HtmlAttributeMangler from "@webmangler/mangler-html-attributes";

import RecommendedManglers, { injectDependencies } from "./class";

injectDependencies(
  CssClassMangler as WebManglerPluginClass,
  CssVariableMangler as WebManglerPluginClass,
  HtmlAttributeMangler as WebManglerPluginClass,
);

export default RecommendedManglers;

export type {
  RecommendedManglersOptions,
};
