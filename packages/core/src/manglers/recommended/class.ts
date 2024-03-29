import type { WebManglerPlugin } from "@webmangler/types";
import type { RecommendedManglersOptions, WebManglerPluginClass } from "./types";

import { MultiManglerPlugin } from "@webmangler/mangler-utils";

let CssClassMangler: WebManglerPluginClass;
let CssVariableMangler: WebManglerPluginClass;
let HtmlAttributeMangler: WebManglerPluginClass;

/**
 * Inject the {@link WebManglerPlugin}s used in the {@link RecommendedManglers}.
 *
 * @param _CssClassMangler The {@link CssClassMangler}.
 * @param _CssVariableMangler The {@link CssVariableMangler}.
 * @param _HtmlAttributeMangler The {@link HtmlAttributeMangler}.
 */
function injectDependencies(
  _CssClassMangler: WebManglerPluginClass,
  _CssVariableMangler: WebManglerPluginClass,
  _HtmlAttributeMangler: WebManglerPluginClass,
): void {
  CssClassMangler = _CssClassMangler;
  CssVariableMangler = _CssVariableMangler;
  HtmlAttributeMangler = _HtmlAttributeMangler;
}

/**
 * This {@link WebManglerPlugin} enables all recommended built-in manglers. The
 * recommended built-in manglers are: {@link CssClassMangler}, {@link
 * CssVariableMangler}, and {@link HtmlAttributeMangler}.
 *
 * To configure any of the individual manglers, the options argument of the
 * constructor must be used. The keys are the same as they are for each
 * individual mangler.
 *
 * If you want to disable any of the individual mangler you have to set
 * `disableCssClassMangling`, `disableCssVarMangling`, or
 * `disableHtmlAttrMangling` to `true`. However, if you don't wish to use all
 * recommended manglers you should consider configuring individual manglers
 * instead.
 *
 * @since v0.1.0
 * @version v0.1.23
 */
class RecommendedManglers extends MultiManglerPlugin {
  /**
   * Instantiate a new {@link RecommendedManglers}.
   *
   * @param options The {@link RecommendedManglersOptions}.
   * @since v0.1.0
   * @version v0.1.23
   */
  constructor(options: RecommendedManglersOptions={}) {
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

    super(plugins);
  }
}

export default RecommendedManglers;

export {
  injectDependencies,
};
