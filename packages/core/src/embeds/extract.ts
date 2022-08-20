import type {
  CharSet,
  Collection,
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "@webmangler/types";

import type {
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
 * @param languagePlugin The {@link WebManglerLanguagePlugin} to extract embeds.
 * @returns All {@link WebManglerEmbed}s in `file`.
 */
function extractEmbedsFromContent(
  file: WebManglerFile,
  languagePlugin: WebManglerLanguagePlugin,
): Collection<IdentifiableWebManglerEmbed> {
  const fileUniqueString: string = generateUniqueString(file.content);
  const fileEmbeds: IdentifiableWebManglerEmbed[] = [];

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

  return fileEmbeds;
}

export {
  extractEmbedsFromContent,
};

export type {
  IdentifiableWebManglerEmbed,
};
