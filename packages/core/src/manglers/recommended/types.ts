import type { WebManglerPlugin } from "../../types";
import type { CssClassManglerOptions } from "../css-classes";
import type { CssVariableManglerOptions } from "../css-variables";
import type { HtmlAttributeManglerOptions } from "../html-attributes";

/**
 * The configuration of the {@link RecommendedManglers}.
 *
 * @since v0.1.0
 */
export interface RecommendedManglersOptions extends
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
 * Type of the constructor of a {@link WebManglerPlugin}.
 */
export type WebManglerPluginClass = {
  new(options?: unknown): WebManglerPlugin;
};

