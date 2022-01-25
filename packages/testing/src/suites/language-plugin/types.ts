import type { WebManglerLanguagePlugin } from"@webmangler/types";

/**
 * The type of a constructor for {@link WebManglerLanguagePlugin}.
 */
type WebManglerLanguagePluginConstructor = new (
  options?: Record<string, unknown>,
) => WebManglerLanguagePlugin;

export type {
  WebManglerLanguagePluginConstructor,
};
