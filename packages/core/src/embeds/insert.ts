import type { WebManglerFile } from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "./types";

import { idPrefix } from "./constants";

/**
 * Re-embed a collection of {@link WebManglerEmbed} into the origin
 * {@link WebManglerFile}.
 *
 * NOTE: This function does not verify the embeds belong in the file.
 *
 * @param embeds The {@link WebManglerEmbed}s to re-embed.
 * @param file The {@link WebManglerFile} to embed into.
 */
function reEmbed(
  embeds: Iterable<IdentifiableWebManglerEmbed>,
  file: WebManglerFile,
): void {
  const _embeds = Array.from(embeds);
  if (_embeds.length === 0) {
    return;
  }

  const map = new Map(_embeds.map((embed) => [idPrefix + embed.id, embed]));
  const idsPattern = _embeds.map((embed) => embed.id).join("|");
  const expr = new RegExp(`${idPrefix}(${idsPattern})`, "g");
  file.content = file.content.replace(expr, (match: string): string => {
    const embed = map.get(match) as IdentifiableWebManglerEmbed;
    return embed.getRaw();
  });
}

export {
  reEmbed,
};

export type {
  IdentifiableWebManglerEmbed,
};
