import type { BuiltInManglersOptions, WebManglerPluginClass } from "./types";

import BuiltInManglers, { injectDependencies } from "./class";
import CssClassMangler from "../css-classes";
import CssVariableMangler from "../css-variables";
import HtmlAttributeMangler from "../html-attributes";
import HtmlIdMangler from "../html-ids";

injectDependencies(
  CssClassMangler as WebManglerPluginClass,
  CssVariableMangler as WebManglerPluginClass,
  HtmlAttributeMangler as WebManglerPluginClass,
  HtmlIdMangler as WebManglerPluginClass,
);

export default BuiltInManglers;

export type { BuiltInManglersOptions };
