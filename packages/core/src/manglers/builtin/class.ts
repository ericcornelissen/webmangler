import type { WebManglerPlugin } from "../../types";
import type { BuiltInManglersOptions, WebManglerPluginClass } from "./types";

import { MultiManglerPlugin } from "../utils";

let CssClassMangler: WebManglerPluginClass;
let CssVariableMangler: WebManglerPluginClass;
let HtmlAttributeMangler: WebManglerPluginClass;
let HtmlIdMangler: WebManglerPluginClass;

/**
 * Inject the {@link WebManglerPlugin}s used in the {@link BuiltInManglers}.
 *
 * @param _CssClassMangler The {@link CssClassMangler}.
 * @param _CssVariableMangler The {@link CssVariableMangler}.
 * @param _HtmlAttributeMangler The {@link HtmlAttributeMangler}.
 * @param _HtmlIdMangler The {@link HtmlIdMangler}.
 */
export function injectDependencies(
  _CssClassMangler: WebManglerPluginClass,
  _CssVariableMangler: WebManglerPluginClass,
  _HtmlAttributeMangler: WebManglerPluginClass,
  _HtmlIdMangler: WebManglerPluginClass,
): void {
  CssClassMangler = _CssClassMangler;
  CssVariableMangler = _CssVariableMangler;
  HtmlAttributeMangler = _HtmlAttributeMangler;
  HtmlIdMangler = _HtmlIdMangler;
}

/**
 * This {@link WebManglerPlugin} enables all built-in manglers.
 *
 * To configure any of the individual manglers, the options argument of the
 * constructor must be used. The keys are the same as they are for each
 * individual mangler.
 *
 * If you want to disable any of the individual mangler you have to set
 * `disableCssClassMangling`, `disableCssVarMangling`,
 * `disableHtmlAttrMangling`, or `disableHtmlIdMangling` to `true`. However, if
 * you don't wish to use all built-in manglers you should consider configuring
 * individual manglers instead.
 *
 * @since v0.1.0
 */
export default class BuiltInManglers extends MultiManglerPlugin {
  /**
   * Instantiate a new {@link BuiltInManglers}.
   *
   * @param options The {@link BuiltInManglersOptions}.
   * @since v0.1.0
   */
  constructor(options: BuiltInManglersOptions={}) {
    const plugins: WebManglerPlugin[] = [];

    if (!options.disableCssClassMangling) {
      plugins.push(new CssClassMangler({
        classNamePattern: options.classNamePattern,
        reservedClassNames: options.reservedClassNames,
        keepClassNamePrefix: options.keepClassNamePrefix,
      }));
    }

    if (!options.disableCssVarMangling) {
      plugins.push(new CssVariableMangler({
        cssVarNamePattern: options.cssVarNamePattern,
        reservedCssVarNames: options.reservedCssVarNames,
        keepCssVarPrefix: options.keepCssVarPrefix,
      }));
    }

    if (!options.disableHtmlAttrMangling) {
      plugins.push(new HtmlAttributeMangler({
        attrNamePattern: options.attrNamePattern,
        reservedAttrNames: options.reservedAttrNames,
        keepAttrPrefix: options.keepAttrPrefix,
      }));
    }

    if (!options.disableHtmlIdMangling) {
      plugins.push(new HtmlIdMangler({
        idNamePattern: options.idNamePattern,
        reservedIds: options.reservedIds,
        keepIdPrefix: options.keepIdPrefix,
      }));
    }

    super(plugins);
  }
}
