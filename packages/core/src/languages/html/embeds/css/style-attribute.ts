import type { WebManglerEmbed, WebManglerFile } from "../../../../types";

import { EMBED_TYPE } from "./common";

/**
 * A regular expression to find style attribute values in HTML.
 */
// eslint-disable-next-line security/detect-unsafe-regex
const REGEXP_STYLE_DECLARATION = /(<[^>]*\sstyle\s*=\s*(?<q>"|'))([^"']*)(\k<q>)/gm;

/**
 * Convert a {@link REGEXP_STYLE_DECLARATION} match into a {@link
 * WebManglerEmbed}.
 *
 * @param match A {@link RegExpExecArray}.
 * @returns The {@link WebManglerEmbed}.
 */
function styleAttributeMatchToEmbed(match: RegExpExecArray): WebManglerEmbed {
  const SELECTOR = ":root";

  const tag = match[1];
  const declarations = match[3];

  const startIndex = match.index + tag.length;
  const endIndex = startIndex + declarations.length;

  return {
    type: EMBED_TYPE,
    startIndex,
    endIndex,
    content: `${SELECTOR}{${declarations}}`,
    getRaw(): string {
      return this.content.slice(SELECTOR.length + 1, -1);
    },
  };
}

/**
 * Extract all style attribute values in a HTML file as CSS embeds.
 *
 * @example
 * const file = { type: "html", content: "<div style=\"color:red;\"></div>" };
 * const embeds = getStyleAttributesAsEmbeds(file);
 * console.log(embeds[0]);  // ":root{color:red;}"
 * @param file A {@link WebManglerFile}.
 * @returns Zero or more {@link WebManglerEmbed}s.
 * @since v0.1.21
 */
export function getStyleAttributesAsEmbeds(
  file: WebManglerFile,
): Iterable<WebManglerEmbed> {
  const result: WebManglerEmbed[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = REGEXP_STYLE_DECLARATION.exec(file.content)) !== null) {
    const embed = styleAttributeMatchToEmbed(match);
    result.push(embed);
  }

  return result;
}
