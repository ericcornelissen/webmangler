import type { BuiltInManglersOptions, WebManglerPluginClass } from "./types";

import CssClassMangler from "@webmangler/mangler-css-classes";
import CssVariableMangler from "@webmangler/mangler-css-variables";
import HtmlAttributeMangler from "@webmangler/mangler-html-attributes";
import HtmlIdMangler from "@webmangler/mangler-html-ids";

import BuiltInManglers, { injectDependencies } from "./class";

injectDependencies(
  CssClassMangler as WebManglerPluginClass,
  CssVariableMangler as WebManglerPluginClass,
  HtmlAttributeMangler as WebManglerPluginClass,
  HtmlIdMangler as WebManglerPluginClass,
);

export default BuiltInManglers;

export type {
  BuiltInManglersOptions,
};
