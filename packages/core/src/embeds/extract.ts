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
 * Compare the `startIndex` of two {@link WebManglerEmbed}s. Can be used to sort
 * {@link WebManglerEmbed}s by their starting index.
 *
 * @param a A {@link WebManglerEmbed}.
 * @param b A {@link WebManglerEmbed}.
 * @returns A integer representing which embed has the lowest `startIndex`.
 */
function compareStartIndex(
  a: Pick<WebManglerEmbed, "startIndex">,
  b: Pick<WebManglerEmbed, "startIndex">,
): number {
  return a.startIndex - b.startIndex;
}

/**
 * Build a function to generate unique substrings for given strings.
 *
 * @param charSet A {@link CharSet} to generate names from.
 * @returns A function to generate a unique substring for a given string.
 */
function buildGenerateUniqueString(
  charSet: CharSet,
) {
  return (str: string): string => {
    const nameGenerator = new NameGenerator({ charSet });

    let subStr = nameGenerator.nextName();
    while (str.includes(subStr)) {
      subStr = nameGenerator.nextName();
    }

    return subStr;
  };
}

/**
 * Build a function to extract embeds from a {@link WebManglerFile}.
 *
 * @param deps The dependency of the `extractEmbedsFromContent` function.
 * @param deps.generateUniqueString A function to generate unique strings.
 * @param deps.idPrefix A string to be used as prefix for embed ids.
 * @returns A function to extract embeds from a {@link WebManglerFile}.
 */
function buildExtractEmbedsFromContent({
  generateUniqueString,
  idPrefix,
}: {
  readonly generateUniqueString: ReturnType<typeof buildGenerateUniqueString>;
  readonly idPrefix: string;
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
  buildGenerateUniqueString,
};

export type {
  IdentifiableWebManglerEmbed,
};
