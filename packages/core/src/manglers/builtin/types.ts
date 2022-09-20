import type { CssClassManglerOptions } from "@webmangler/mangler-css-classes";
import type { CssVariableManglerOptions } from "@webmangler/mangler-css-variables";
import type { HtmlAttributeManglerOptions } from "@webmangler/mangler-html-attributes";
import type { HtmlIdManglerOptions } from "@webmangler/mangler-html-ids";
import type { WebManglerPlugin } from "@webmangler/types";

/**
 * The configuration of the {@link BuiltInManglers}.
 *
 * @since v0.1.0
 * @version v0.1.28
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
   * @version v0.1.28
   */
  readonly disableCssClassMangling?: boolean;

  /**
   * Disable the {@see CssVariableMangler}.
   *
   * @since v0.1.0
   * @version v0.1.28
   */
   readonly disableCssVarMangling?: boolean;

  /**
   * Disable the {@see HtmlAttributeMangler}.
   *
   * @since v0.1.0
   * @version v0.1.28
   */
   readonly disableHtmlAttrMangling?: boolean;

  /**
   * Disable the {@see HtmlIdMangler}.
   *
   * @since v0.1.0
   * @version v0.1.28
   */
   readonly disableHtmlIdMangling?: boolean;
}

/**
 * Type of the constructor of a {@link WebManglerPlugin}.
 */
interface WebManglerPluginClass {
  new(options?: unknown): WebManglerPlugin;
}

export type {
  BuiltInManglersOptions,
  WebManglerPluginClass,
};
