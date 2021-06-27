import type { WebManglerPlugin } from "../../types";
import type {
  RecommendedManglersOptions,
  WebManglerPluginClass,
} from "./types";

import { MultiManglerPlugin } from "../utils";

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
export function injectDependencies(
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
 */
export default class RecommendedManglers extends MultiManglerPlugin {
  /**
   * Instantiate a new {@link RecommendedManglers}.
   *
   * @param options The {@link RecommendedManglersOptions}.
   * @since v0.1.0
   */
  constructor(options: RecommendedManglersOptions={}) {
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

    super(plugins);
  }
}

export type { RecommendedManglersOptions };
