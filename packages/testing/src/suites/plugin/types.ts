import type { WebManglerPlugin } from"@webmangler/types";

/**
 * The type of a constructor for {@link WebManglerPlugin}.
 */
type WebManglerPluginConstructor = new (
  options?: Record<string, unknown>,
) => WebManglerPlugin;

export type {
  WebManglerPluginConstructor,
};
