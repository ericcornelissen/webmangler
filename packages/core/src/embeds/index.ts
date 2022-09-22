import type {
  ReadonlyCollection,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type {
  EmbedsMap,
  IdentifiableWebManglerEmbed,
} from "./types";

import { idCharSet, idPrefix } from "./constants";
import {
  buildExtractEmbedsFromContent,
  buildGenerateUniqueString,
} from "./extract";
import * as F from "./functional";
import { buildReEmbed } from "./insert";

/**
 * Generate a unique string that does not appear in a larger string.
 *
 * @param s The string for which to generate a unique string.
 * @returns A unique string that does not appear in `s`.
 */
const generateUniqueString = buildGenerateUniqueString(idCharSet);

/**
 * Get all {@link WebManglerEmbed}s in a {@link WebManglerFile} found by
 * {@link WebManglerLanguagePlugin}s.
 *
 * @param file The {@link WebManglerFile} to get embeds from.
 * @param languagePlugin The {@link WebManglerLanguagePlugin} to extract embeds.
 * @returns All {@link WebManglerEmbed}s in `file`.
 */
const extractEmbedsFromContent = buildExtractEmbedsFromContent({
  generateUniqueString,
  idPrefix,
});

/**
 * Get all {@link WebManglerEmbed}s in a collection of {@link WebManglerFile}s
 * found by {@link WebManglerLanguagePlugin}s, non-recursively.
 *
 * @param files The {@link WebManglerFile}s to get embeds from.
 * @param languagePlugins The {@link WebManglerLanguagePlugin}s.
 * @returns All {@link WebManglerEmbed}s per file in `files`.
 */
const getEmbedsOnce: (
  languagePlugins: Iterable<WebManglerLanguagePlugin>,
) => (
  files: ReadonlyCollection<WebManglerFile>,
) => EmbedsMap = F.partialRight2(
  F.pipe(
    F.crossProduct,
    F.reduceBy(
      F.toListReducer(F.spread(extractEmbedsFromContent)),
      [],
      F.first,
    ),
  ),
);

/**
 * Get all {@link WebManglerEmbed}s in a collection of {@link WebManglerFile}s
 * found by {@link WebManglerLanguagePlugin}s.
 *
 * NOTE: This function changes the `content` of every file that has at least one
 * embed.
 *
 * @param files The {@link WebManglerFile}s to get embeds from.
 * @param languagePlugins The {@link WebManglerLanguagePlugin}s.
 * @returns All {@link WebManglerEmbed}s per file in `files`.
 */
const getEmbeds = (
  files: ReadonlyCollection<WebManglerFile>,
  languagePlugins: Iterable<WebManglerLanguagePlugin>,
): EmbedsMap => F.pipe(
  F.recurse(
    F.map(getEmbedsOnce(languagePlugins)),
    F.flatMap(F.values),
    F.pipe(F.empty, F.not),
  ),
  F.flatten,
  F.reverse,
  F.merge,
)([files]);

/**
 * Re-embed a collection of {@link WebManglerEmbed} into the origin
 * {@link WebManglerFile}.
 *
 * NOTE: This function does not verify the embeds belong in the file.
 *
 * @param embeds The {@link WebManglerEmbed}s to re-embed.
 * @param file The {@link WebManglerFile} to embed into.
 */
const reEmbed = buildReEmbed({
  idPrefix,
});

export {
  getEmbeds,
  reEmbed,
};

export type {
  IdentifiableWebManglerEmbed,
};
