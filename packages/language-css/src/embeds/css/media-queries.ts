import type { WebManglerEmbed, WebManglerFile } from "@webmangler/types";

/**
 * A regular expression to find media queries in CSS.
 */
const REGEXP_MEDIA_QUERY = /(?:\/\*(?:.|\n|\r)*?\*\/|(?<q>@media\s+[^{]*{)(?<v>(?:{[^}]*}|[^}])+)})/gmi;

/**
 * Convert a {@link REGEXP_MEDIA_QUERY} match into a {@link WebManglerEmbed}.
 *
 * @param match A {@link RegExpExecArray}.
 * @returns The {@link WebManglerEmbed}, or `null` if the match was improper.
 */
function matchToEmbed(
  match: RegExpExecArray,
): WebManglerEmbed | null {
  const groups = match.groups as { [key: string]: string; };
  const query = groups.q;
  const stylesheet = groups.v;
  if (stylesheet === undefined) {
    return null;
  }

  const startIndex = match.index + query.length;
  const endIndex = startIndex + stylesheet.length;

  return {
    type: "css",
    startIndex,
    endIndex,
    content: stylesheet,
    getRaw(): string {
      return this.content;
    },
  };
}

/**
 * Find all media query embeds in a file given a Regular Expression that
 * matches media queries.
 *
 * @param file A {@link WebManglerFile}.
 * @param regExp A {@link RegExp}.
 * @returns Zero or more {@link WebManglerEmbed}s.
 */
function matchAndGetEmbeds(
  file: WebManglerFile,
  regExp: RegExp,
): Iterable<WebManglerEmbed> {
  const result: WebManglerEmbed[] = [];

  let match: RegExpExecArray | null = null;
  while ((match = regExp.exec(file.content)) !== null) {
    const embed = matchToEmbed(match);
    if (embed !== null) {
      result.push(embed);
    }
  }

  return result;
}

/**
 * Extract all media queries in a CSS file as CSS embeds.
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
    ...matchAndGetEmbeds(file, REGEXP_MEDIA_QUERY),
  ];
}

export {
  getMediaQueriesAsEmbeds,
};
