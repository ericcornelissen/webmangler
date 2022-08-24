import type {
  Collection,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type {
  EmbedsMap,
  IdentifiableWebManglerEmbed,
} from "./types";

import { idPrefix } from "./constants";
import {
  buildExtractEmbedsFromContent,
  compareStartIndex,
  generateUniqueString,
} from "./extract";
import * as F from "./functional";
import { reEmbed } from "./insert";

/**
 * Get all {@link WebManglerEmbed}s in a {@link WebManglerFile} found by
 * {@link WebManglerLanguagePlugin}s.
 *
 * @param file The {@link WebManglerFile} to get embeds from.
 * @param languagePlugin The {@link WebManglerLanguagePlugin} to extract embeds.
 * @returns All {@link WebManglerEmbed}s in `file`.
 */
const extractEmbedsFromContent = buildExtractEmbedsFromContent({
  compareStartIndex,
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
  files: Collection<WebManglerFile>,
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
  files: Collection<WebManglerFile>,
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

export {
  getEmbeds,
  reEmbed,
};

export type {
  IdentifiableWebManglerEmbed,
};
