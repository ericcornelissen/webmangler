import type {
  WebManglerEmbed,
  WebManglerFile,
  WebManglerLanguagePlugin,
} from "./types";

type EmbedsMap = Map<WebManglerFile, Iterable<IdentifiableWebManglerEmbed>>;

/**
 * Extension of {@link WebManglerEmbed} with an identifier.
 *
 * @since v0.1.21
 */
export interface IdentifiableWebManglerEmbed extends WebManglerEmbed {
  /**
   * The identifier of the {@link WebManglerEmbed}.
   *
   * @since v0.1.21
   */
  readonly id: string;
}

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
  let id = "";
  while (s.includes(id)) {
    id = "";
    for (let i = 0; i < 64; i++) {
      id += Math.floor(Math.random() * 10).toString(16);
    }
  }

  return id;
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
): Iterable<IdentifiableWebManglerEmbed> {
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
      builder.push(preEmbed, embedId);

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
export function getEmbeds(
  files: Iterable<WebManglerFile>,
  languagePlugins: Iterable<WebManglerLanguagePlugin>,
): EmbedsMap {
  const embeds: EmbedsMap = new Map();
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
  embeds: Iterable<IdentifiableWebManglerEmbed>,
  file: WebManglerFile,
): void {
  const _embeds = Array.from(embeds);
  if (_embeds.length === 0) {
    return;
  }

  const map = new Map(_embeds.map((embed) => [embed.id, embed]));
  const rawExpr = _embeds.map((embed) => embed.id).join("|");
  const expr = new RegExp(rawExpr, "g");
  file.content = file.content.replace(expr, (match: string): string => {
    const embed = map.get(match) as IdentifiableWebManglerEmbed;
    return embed.getRaw();
  });
}
