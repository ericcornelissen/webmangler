import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

/**
 * Extract all style attribute values in a HTML file as CSS embeds.
 *
 * @example
 * const file = { type: "css", content: "@media screen { .foobar{} }" };
 * const embeds = getMediaQueriesAsEmbeds(file);
 * console.log(embeds[0]);  // ".foobar{}"
 * @param file A {@link WebManglerFile}.
 * @returns Zero or more {@link WebManglerEmbed}s.
 */
function getMediaQueriesAsEmbeds(
  file: WebManglerFile,
): Iterable<WebManglerEmbed> {
  return [
    // TODO: Add implementation
  ];
}

export {
  getMediaQueriesAsEmbeds,
};
