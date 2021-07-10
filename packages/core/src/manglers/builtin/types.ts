import type { WebManglerPlugin } from "../../types";
import type { CssClassManglerOptions } from "../css-classes";
import type { CssVariableManglerOptions } from "../css-variables";
import type { HtmlAttributeManglerOptions } from "../html-attributes";
import type { HtmlIdManglerOptions } from "../html-ids";

/**
 * The configuration of the {@link BuiltInManglers}.
 *
 * @since v0.1.0
 */
export interface BuiltInManglersOptions extends
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
 * Type of the constructor of a {@link WebManglerPlugin}.
 */
export type WebManglerPluginClass = {
  new(options?: unknown): WebManglerPlugin;
};
