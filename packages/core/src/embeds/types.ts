import type {
  Collection,
  WebManglerEmbed,
  WebManglerFile,
} from "@webmangler/types";

/**
 * A mapping from {@link WebManglerFile}s to {@link WebManglerEmbed}s in that
 * file.
 */
type EmbedsMap = Map<WebManglerFile, Collection<IdentifiableWebManglerEmbed>>;

/**
 * Extension of {@link WebManglerEmbed} with an identifier.
 */
interface IdentifiableWebManglerEmbed extends WebManglerEmbed {
  /**
   * The identifier of the {@link WebManglerEmbed}.
   */
  readonly id: string;
}

export type {
  EmbedsMap,
  IdentifiableWebManglerEmbed,
};
