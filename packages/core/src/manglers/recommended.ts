import type { WebManglerPlugin } from "../types";
import type { CssClassManglerOptions } from "./css-classes";
import type { CssVariableManglerOptions } from "./css-variables";
import type { HtmlAttributeManglerOptions } from "./html-attributes";

import { MultiManglerPlugin } from "./utils";
import CssClassMangler from "./css-classes";
import CssVariableMangler from "./css-variables";
import HtmlAttributeMangler from "./html-attributes";

/**
 * The configuration of the {@link RecommendedManglers}.
 *
 * To disable any individual mangler the `pattern` option of that mangler can be
 * set to `undefined`.
 *
 * @since v0.1.0
 */
interface RecommendedManglersOptions extends
  CssClassManglerOptions,
  CssVariableManglerOptions,
  HtmlAttributeManglerOptions {
  /**
   * Disable the {@see CssClassMangler}.
   *
   * @since v0.1.0
   */
  disableCssClassMangling?: boolean;

  /**
   * Disable the {@see CssVariableMangler}.
   *
   * @since v0.1.0
   */
  disableCssVarMangling?: boolean;

  /**
   * Disable the {@see HtmlAttributeMangler}.
   *
   * @since v0.1.0
   */
  disableHtmlAttrMangling?: boolean;
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
export default class RecommendedManglers extends MultiManglerPlugin {
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

export type { RecommendedManglersOptions };