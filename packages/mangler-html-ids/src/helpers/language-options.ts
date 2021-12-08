import type {
  MangleExpressionOptions,
  QuerySelectorOptions,
  SingleValueAttributeOptions,
} from "@webmangler/types";

/**
 * A list of the attributes always treated as `id` by {@link HtmlIdMangler}.
 */
const STANDARD_ID_ATTRIBUTES: Iterable<string> = [
  "id",
  "for",
];

/**
 * A list of the attributes always treated as URL by {@link HtmlIdMangler}.
 */
const STANDARD_URL_ATTRIBUTES: Iterable<string> = [
  "href",
];

/**
 * The options for HTML id mangler id attribute expression options.
 */
interface IdAttributeExpressionOptions {
  /**
   * One or more HTML attributes whose values should be treated as ids, if any.
   */
  readonly idAttributes?: Iterable<string>;
}

/**
 * Get the {@link MangleExpressionOptions} for mangling id-like attributes.
 * The `id` and `for` attributes are always included.
 *
 * @param options The {@link IdAttributeExpressionOptions}.
 * @param options.idAttributes The attributes to treat as `id`s.
 * @returns The {@link SingleValueAttributeOptions}.
 */
function getIdAttributeExpressionOptions({
  idAttributes = [],
}: IdAttributeExpressionOptions):
    MangleExpressionOptions<SingleValueAttributeOptions> {
  return {
    name: "single-value-attributes",
    options: {
      attributeNames: new Set([
        ...STANDARD_ID_ATTRIBUTES,
        ...idAttributes,
      ]),
    },
  };
}
/**
 * Get the {@link MangleExpressionOptions} for mangling id query selectors.
 *
 * @returns The {@link QuerySelectorOptions}.
 */
function getQuerySelectorExpressionOptions():
    MangleExpressionOptions<QuerySelectorOptions> {
  return {
    name: "query-selectors",
    options: {
      prefix: "#",
    },
  };
}

/**
 * The options for HTML id mangler id attribute expression options.
 */
interface UrlAttributeExpressionOptions {
  /**
   * One or more HTML attributes whose values should be treated as URLs, if any.
   */
  readonly urlAttributes?: Iterable<string>;
}

/**
 * Get the {@link MangleExpressionOptions} for mangling URL attributes. The
 * `href` attribute is always included.
 *
 * @param options The {@link UrlAttributeExpressionOptions}.
 * @param options.urlAttributes The attributes to treat as URLs.
 * @returns The {@link SingleValueAttributeOptions}.
 */
function getUrlAttributeExpressionOptions({
  urlAttributes = [],
}: UrlAttributeExpressionOptions):
    MangleExpressionOptions<SingleValueAttributeOptions> {
  return {
    name: "single-value-attributes",
    options: {
      attributeNames: new Set([
        ...STANDARD_URL_ATTRIBUTES,
        ...urlAttributes,
      ]),
      valuePrefix: "[a-zA-Z0-9\\-\\_\\/\\.\\?]*(\\?[a-zA-Z0-9\\_\\-\\=\\%]+)?#",
    },
  };
}

export {
  getIdAttributeExpressionOptions,
  getQuerySelectorExpressionOptions,
  getUrlAttributeExpressionOptions,
};
