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
function _compareStartIndex(
  a: Pick<WebManglerEmbed, "startIndex">,
  b: Pick<WebManglerEmbed, "startIndex">,
): number {
  return a.startIndex - b.startIndex;
}

/**
 * Generate a unique string that does not appear in a larger string.
 *
 * @param s The string for which to generate a unique string.
 * @returns A unique string that does not appear in `s`.
 */
function _generateUniqueString(s: string): string {
  const nameGenerator = new NameGenerator({ charSet: idCharSet });

  let id = nameGenerator.nextName();
  while (s.includes(id)) {
    id = nameGenerator.nextName();
  }

  return id;
}

/**
 * Build a function to extract embeds from a {@link WebManglerFile}.
 *
 * @param deps The dependency of the `extractEmbedsFromContent` function.
 * @param deps.compareStartIndex A function to compare {@link WebManglerFile}s.
 * @param deps.generateUniqueString A function to generate unique strings.
 * @param deps.idPrefix A string to be used as prefix for embed ids.
 * @returns A function to extract embeds from a {@link WebManglerFile}.
 */
function buildExtractEmbedsFromContent({
  compareStartIndex,
  generateUniqueString,
  idPrefix,
}: {
  compareStartIndex: typeof _compareStartIndex;
  generateUniqueString: typeof _generateUniqueString;
  idPrefix: string;
}) {
  return function(
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
  };
}

export {
  buildExtractEmbedsFromContent,
  _compareStartIndex as compareStartIndex,
  _generateUniqueString as generateUniqueString,
};

export type {
  IdentifiableWebManglerEmbed,
};
