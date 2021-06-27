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
 * @version v0.1.23
 */
export default class BuiltInManglers extends MultiManglerPlugin {
  /**
   * Instantiate a new {@link BuiltInManglers}.
   *
   * @param options The {@link BuiltInManglersOptions}.
   * @since v0.1.0
   * @version v0.1.23
   */
  constructor(options: BuiltInManglersOptions={}) {
    const plugins: WebManglerPlugin[] = [];

    if (!options.disableCssClassMangling) {
      const cssClassMangler = new CssClassMangler(options);
      plugins.push(cssClassMangler);
    }

    if (!options.disableCssVarMangling) {
      const cssVariableMangler = new CssVariableMangler(options);
      plugins.push(cssVariableMangler);
    }

    if (!options.disableHtmlAttrMangling) {
      const htmlAttributeMangler = new HtmlAttributeMangler(options);
      plugins.push(htmlAttributeMangler);
    }

    if (!options.disableHtmlIdMangling) {
      const htmlIdMangler = new HtmlIdMangler(options);
      plugins.push(htmlIdMangler);
    }

    super(plugins);
  }
}
