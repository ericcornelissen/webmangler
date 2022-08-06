import type {
  CharSet,
  Collection,
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type {
  EmbedsMap,
  IdentifiableWebManglerEmbed,
} from "./types";

import NameGenerator from "../name-generator.class";
import { idPrefix } from "./constants";

/**
 * The {@link CharSet} used to generate unique identifiers for embed locations.
 */
const idCharSet: CharSet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
  "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D",
  "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
  "T", "U", "V", "W", "X", "Y", "Z", "0", "1", "2", "3", "4", "5", "6", "7",
  "8", "9",
];

/**
 * Compare the `startIndex` of two {@link WebManglerEmbed}s. Can be used to sort
 * {@link WebManglerEmbed}s by their starting index.
 *
 * @param a A {@link WebManglerEmbed}.
 * @param b A {@link WebManglerEmbed}.
 * @returns A integer representing which embed has the lowest `startIndex`.
 */
function compareStartIndex(a: WebManglerEmbed, b: WebManglerEmbed): number {
  return a.startIndex - b.startIndex;
}

/**
 * Generate a unique string that does not appear in a larger string.
 *
 * @param s The string for which to generate a unique string.
 * @returns A unique string that does not appear in `s`.
 */
function generateUniqueString(s: string): string {
  const nameGenerator = new NameGenerator({ charSet: idCharSet });

  let id = nameGenerator.nextName();
  while (s.includes(id)) {
    id = nameGenerator.nextName();
  }

  return id;
}

/**
 * Get all {@link WebManglerEmbed}s in a {@link WebManglerFile} found by
 * {@link WebManglerLanguagePlugin}s.
 *
 * @param file The {@link WebManglerFile} to get embeds from.
 * @param languagePlugins The {@link WebManglerLanguagePlugin}s.
 * @returns All {@link WebManglerEmbed}s in `file`.
 */
function getEmbedsInFile(
  file: WebManglerFile,
  languagePlugins: Iterable<WebManglerLanguagePlugin>,
): Collection<IdentifiableWebManglerEmbed> {
  const fileUniqueString: string = generateUniqueString(file.content);
  const fileEmbeds: IdentifiableWebManglerEmbed[] = [];
  for (const languagePlugin of languagePlugins) {
    const rawEmbeds = Array.from(languagePlugin.getEmbeds(file));
    const sortedEmbeds = rawEmbeds.sort(compareStartIndex);

    let prevEmbedEndIndex = 0;
    const builder: string[] = [];
    for (const embed of sortedEmbeds) {
      const embedId = `${fileUniqueString}-${embed.startIndex}`;
      fileEmbeds.push({ ...embed, id: embedId });

      const preEmbed = file.content.slice(prevEmbedEndIndex, embed.startIndex);
      builder.push(preEmbed, idPrefix, embedId);

      prevEmbedEndIndex = embed.endIndex;
    }
    builder.push(file.content.slice(prevEmbedEndIndex));
    file.content = builder.join("");
  }

  return fileEmbeds;
}

/**
 * Get all {@link WebManglerEmbed}s in a collection of {@link WebManglerFile}s
 * found by {@link WebManglerLanguagePlugin}s.
 *
 * NOTE: This function changes the `content` of every file that has at least one
 * embed.
 *
 * @param files The {@link WebManglerFile}s to get embeds from.
 * @param languagePlugins The {@link WebManglerLanguagePlugin}s.
 * @returns All {@link WebManglerEmbed}s in `files`.
 */
function getEmbeds(
  files: Collection<WebManglerFile>,
  languagePlugins: Iterable<WebManglerLanguagePlugin>,
): EmbedsMap {
  const embeds: EmbedsMap = new Map();
  for (const file of files) {
    const fileEmbeds = getEmbedsInFile(file, languagePlugins);
    if (Array.from(fileEmbeds).length !== 0) {
      const embedEmbeds = getEmbeds(fileEmbeds, languagePlugins);
      embedEmbeds.forEach((value, key) => embeds.set(key, value));
    }

    embeds.set(file, fileEmbeds);
  }

  return embeds;
}

export {
  getEmbeds,
};

export type {
  IdentifiableWebManglerEmbed,
};
