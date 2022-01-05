import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

import { EMBED_TYPE } from "./common";

/**
 * A regular expression to find script tags in HTML.
 */
const REGEXP_SCRIPT_TAG = /(?:<!--(?:.|\n|\r)*?-->|(?<t><\s*script(?:>|\s[^>]*>))(?<v>[^<]+)<\/script\s*>)/gmi;

/**
 * Convert a {@link REGEXP_SCRIPT_TAG} match into a {@link WebManglerEmbed}.
 *
 * @param match A {@link RegExpExecArray}.
 * @returns The {@link WebManglerEmbed}.
 */
function scriptTagMatchToEmbed(match: RegExpExecArray): WebManglerEmbed | null {
  const groups = match.groups as { [key: string]: string; };
  const tag = groups.t;
  const script = groups.v;
  if (script === undefined) {
    return null;
  }

  const startIndex = match.index + tag.length;
  const endIndex = startIndex + script.length;

  return {
    type: EMBED_TYPE,
    startIndex,
    endIndex,
    content: script,
    getRaw(): string {
      return this.content;
    },
  };
}

/**
 * Extract all script tags values in a HTML file as JavaScript embeds.
 *
 * @example
 * const file = { type: "html", content: "<script>console.log(42);</script>" };
 * const embeds = getScriptTagsAsEmbeds(file);
 * console.log(embeds[0]);  //  "console.log(42);"
 * @param file A {@link WebManglerFile}.
 * @returns Zero or more {@link WebManglerEmbed}s.
 * @since v0.1.21
 */
export function getScriptTagsAsEmbeds(
  file: WebManglerFile,
): Iterable<WebManglerEmbed> {
  const result: WebManglerEmbed[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = REGEXP_SCRIPT_TAG.exec(file.content)) !== null) {
    const embed = scriptTagMatchToEmbed(match);
    if (embed !== null) {
      result.push(embed);
    }
  }

  return result;
}
