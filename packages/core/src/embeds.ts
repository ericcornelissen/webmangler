import type {
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "./types";

let runIdentifier = "";

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
 * Generate a unique identifer for a _WebMangler_ run.
 *
 * @param files The {@link WebManglerFile}s in the run.
 */
function generateRunIdentifier(files: Iterable<WebManglerFile>) {
  const contents = Array.from(files).map((file) => file.content);
  while (contents.some((content) => content.includes(runIdentifier))) {
    runIdentifier = "";
    for (let i = 0; i < 64; i++) {
      runIdentifier += Math.floor(Math.random() * 10).toString(16);
    }
  }
}

/**
 * Get a unique(*) identifer for a given embed.
 *
 * (*): The identifer will be unique w.r.t. the file in which it appears.
 *
 * @param embed A {@link WebManglerEmbed}.
 * @returns A unique identifer for the `embed`.
 */
function getEmbedId(embed: WebManglerEmbed) {
  return `[${runIdentifier}-${embed.startIndex}-${embed.endIndex}]`;
}

/**
 * Get all {@link WebManglerEmbed}s in a {@link WebManglerFile} found by {@link
 * WebManglerLanguagePlugin}s.
 *
 * @param file The {@link WebManglerFile} to get embeds from.
 * @param languagePlugins The {@link WebManglerLanguagePlugin}s.
 * @returns All {@link WebManglerEmbed}s in `file`.
 */
function getEmbedsInFile(
  file: WebManglerFile,
  languagePlugins: Iterable<WebManglerLanguagePlugin>,
): Iterable<WebManglerEmbed> {
  const fileEmbeds: WebManglerEmbed[] = [];
  for (const languagePlugin of languagePlugins) {
    const rawEmbeds = Array.from(languagePlugin.getEmbeds(file));
    const sortedEmbeds = rawEmbeds.sort(compareStartIndex);

    let offset = 0;
    for (const embed of sortedEmbeds) {
      const embedId = getEmbedId(embed);
      fileEmbeds.push(embed);

      const pre = file.content.slice(0, embed.startIndex + offset);
      const post = file.content.slice(embed.endIndex + offset);
      file.content = `${pre}${embedId}${post}`;

      const embedLength = embed.endIndex - embed.startIndex;
      offset += (embedId.length - embedLength);
    }
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
export function getEmbeds(
  files: Iterable<WebManglerFile>,
  languagePlugins: Iterable<WebManglerLanguagePlugin>,
): Map<WebManglerFile, Iterable<WebManglerEmbed>> {
  generateRunIdentifier(files);

  const embeds: Map<WebManglerFile, Iterable<WebManglerEmbed>> = new Map();
  for (const file of files) {
    const fileEmbeds = getEmbedsInFile(file, languagePlugins);
    embeds.set(file, fileEmbeds);
  }

  return embeds;
}

/**
 * Re-embed a collection of {@link WebManglerEmbed} into the origin
 * {@link WebManglerFile}.
 *
 * NOTE: This function does not verify the embeds belong in the file.
 *
 * @param embeds The {@link WebManglerEmbed}s to re-embed.
 * @param file The {@link WebManglerFile} to embed into.
 */
export function reEmbed(
  embeds: Iterable<WebManglerEmbed>,
  file: WebManglerFile,
): void {
  for (const embed of embeds) {
    const embedId = getEmbedId(embed);
    const newEmbedContent = embed.getRaw();
    file.content = file.content.replace(embedId, newEmbedContent);
  }
}
