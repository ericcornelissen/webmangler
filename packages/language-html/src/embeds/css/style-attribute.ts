import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

import { EMBED_TYPE } from "./common";

/**
 * A regular expression to find style attribute with quoted values in HTML.
 */
const REGEXP_QUOTED = /(?:<!--.*-->|(?<=<\s*[a-z]+\s+(?:[^>\s=]+(?:\s*=\s*(?:"|')[^"']*(?:"|'))?\s+)*style\s*=\s*(?<q>"|'))(?<v>[^"']+)(?=\k<q>))/gm;

/**
 * A regular expression to find style attribute with unquoted values in HTML.
 */
const REGEXP_UNQUOTED = /(?:<!--.*-->|(?<=<\s*[a-z]+\s+(?:[^>\s=]+(?:\s*=\s*(?:"|')[^"']*(?:"|'))?\s+)*style\s*=\s*)(?<v>[^"'\s/>]+))/gm;

/**
 * Convert a {@link REGEXP_QUOTED} or {@link REGEXP_UNQUOTED} match into a
 * {@link WebManglerEmbed}.
 *
 * @param match A {@link RegExpExecArray}.
 * @returns The {@link WebManglerEmbed}.
 */
function styleAttributeMatchToEmbed(
  match: RegExpExecArray,
): WebManglerEmbed | null {
  const SELECTOR = ":root";

  const groups = match.groups as { [key: string]: string; };
  const declarations = groups.v;
  if (declarations === undefined) {
    return null;
  }

  const startIndex = match.index;
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
 * Find all style attribute embeds in a file given a Regular Expression that
 * matches style attributes.
 *
 * @param file A {@link WebManglerFile}.
 * @param regExp A Regular Expression.
 * @returns Zero or more {@link WebManglerEmbed}s.
 */
function matchAndGetEmbeds(
  file: WebManglerFile,
  regExp: RegExp,
): Iterable<WebManglerEmbed> {
  const result: WebManglerEmbed[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = regExp.exec(file.content)) !== null) {
    const embed = styleAttributeMatchToEmbed(match);
    if (embed !== null) {
      result.push(embed);
    }
  }

  return result;
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
  return [
    ...matchAndGetEmbeds(file, REGEXP_QUOTED),
    ...matchAndGetEmbeds(file, REGEXP_UNQUOTED),
  ];
}
