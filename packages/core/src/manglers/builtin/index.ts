import MultiMangler from "../utils/multi-mangler.class";

import CssClassMangler from "../css-classes";
import CssVariableMangler from "../css-variables";
import HtmlAttributeMangler from "../html-attributes";
import HtmlIdMangler from "../html-ids";

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
export default class BuiltInManglers extends MultiMangler {
  /**
   * Instantiate a new {@link BuiltInManglers}.
   *
   * @param options The {@link BuiltInManglersOptions}.
   * @since v0.1.0
   */
  constructor(options: BuiltInManglersOptions) {
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
