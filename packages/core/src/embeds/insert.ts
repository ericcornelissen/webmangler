import type { WebManglerFile } from "@webmangler/types";

import type { IdentifiableWebManglerEmbed } from "./types";

/**
 * Build a function to re-embed a collection of {@link WebManglerEmbed} into the
 * original {@link WebManglerFile}.
 *
 * NOTE: This function does not verify the embeds belong in the file.
 *
 * @param deps The dependency of the `reEmbed` function.
 * @param deps.idPrefix A string to be used as prefix for embed ids.
 * @returns A function to re-embed embeds into a {@link WebManglerFile}.
 */
function buildReEmbed({
  idPrefix,
}: {
  readonly idPrefix: string;
}) {
  return (
    embeds: Iterable<IdentifiableWebManglerEmbed>,
    file: WebManglerFile,
  ) => {
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
  };
}

export {
  buildReEmbed,
};

export type {
  IdentifiableWebManglerEmbed,
};
