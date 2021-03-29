import type { WebManglerPlugin } from "../types";
import type { CssClassManglerOptions } from "./css-classes";
import type { CssVariableManglerOptions } from "./css-variables";
import type { HtmlAttributeManglerOptions } from "./html-attributes";
import type { HtmlIdManglerOptions } from "./html-ids";

import { MultiManglerPlugin } from "./utils";
import CssClassMangler from "./css-classes";
import CssVariableMangler from "./css-variables";
import HtmlAttributeMangler from "./html-attributes";
import HtmlIdMangler from "./html-ids";

/**
 * The configuration of the {@link BuiltInManglers}.
 *
 * To disable any individual mangler the `pattern` option of that mangler can be
 * set to `undefined`.
 *
 * @since v0.1.0
 */
interface BuiltInManglersOptions extends
  CssClassManglerOptions,
  CssVariableManglerOptions,
  HtmlAttributeManglerOptions,
  HtmlIdManglerOptions {
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

  /**
   * Disable the {@see HtmlIdMangler}.
   *
   * @since v0.1.0
   */
  disableHtmlIdMangling?: boolean;
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

export type { BuiltInManglersOptions };
