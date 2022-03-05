import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

import { EMBED_TYPE } from "./common";

/**
 * A regular expression to find style tags in HTML.
 */
const REGEXP_STYLE_TAG = /(?:<!--(?:.|\n|\r)*?--!?>|(?<t><\s*style(?:\s[^>]*>|>))(?<v>[^<]+)<\/style("[^"]*"|'[^']*'|[^>"'])*?>)/gmi;

/**
 * Convert a {@link REGEXP_STYLE_TAG} match into a {@link WebManglerEmbed}.
 *
 * @param match A {@link RegExpExecArray}.
 * @returns The {@link WebManglerEmbed}.
 */
function styleTagMatchToEmbed(match: RegExpExecArray): WebManglerEmbed | null {
  const groups = match.groups as { [key: string]: string; };
  const tag = groups.t;
  const stylesheet = groups.v;
  if (stylesheet === undefined) {
    return null;
  }

  const startIndex = match.index + tag.length;
  const endIndex = startIndex + stylesheet.length;

  return {
    type: EMBED_TYPE,
    startIndex,
    endIndex,
    content: stylesheet,
    getRaw(): string {
      return this.content;
    },
  };
}

/**
 * Extract all style tags values in a HTML file as CSS embeds.
 *
 * @example
 * const file = { type: "html", content: "<style>.foo{ color:red; }</style>" };
 * const embeds = getStyleTagsAsEmbeds(file);
 * console.log(embeds[0]);  // ".foo{ color:red; }"
 * @param file A {@link WebManglerFile}.
 * @returns Zero or more {@link WebManglerEmbed}s.
 * @since v0.1.21
 */
export function getStyleTagsAsEmbeds(
  file: WebManglerFile,
): Iterable<WebManglerEmbed> {
  const result: WebManglerEmbed[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = REGEXP_STYLE_TAG.exec(file.content)) !== null) {
    const embed = styleTagMatchToEmbed(match);
    if (embed !== null) {
      result.push(embed);
    }
  }

  return result;
}
