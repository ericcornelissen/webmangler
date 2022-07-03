import type {
  MangleExpressionOptions,
  MultiValueAttributeOptions,
  QuerySelectorOptions,
} from "@webmangler/types";

/**
 * The options for CSS class mangler class attribute expression options.
 */
interface ClassAttributeExpressionOptions {
  /**
   * One or more HTML attributes whose values should be treated as classes, if
   * any.
   */
  readonly classAttributes?: Iterable<string>;
}

/**
 * A list of the attributes always consider as `class`-like by a
 * {@link CssClassMangler}.
 */
const STANDARD_CLASS_ATTRIBUTES: string[] = [
  "class",
];

/**
 * Get the {@link MangleExpressionOptions} for mangling class-like attributes.
 * The attribute `class` is always included.
 *
 * @param options The {@link ClassAttributeExpressionOptions}.
 * @param options.classAttributes The attributes to treat as `class`-like.
 * @returns The {@link MangleExpressionOptions}.
 */
function getClassAttributeExpressionOptions({
  classAttributes = [],
}: ClassAttributeExpressionOptions):
    MangleExpressionOptions<MultiValueAttributeOptions> {
  return {
    name: "multi-value-attributes",
    options: {
      attributeNames: new Set([
        ...STANDARD_CLASS_ATTRIBUTES,
        ...classAttributes,
      ]),
    },
  };
}

/**
 * Get the {@link MangleExpressionOptions} for mangling class query selectors.
 *
 * @returns The {@link MangleExpressionOptions}.
 */
function getQuerySelectorExpressionOptions():
    MangleExpressionOptions<QuerySelectorOptions> {
  return {
    name: "query-selectors",
    options: {
      prefix: "\\.",
    },
  };
}

export {
  getClassAttributeExpressionOptions,
  getQuerySelectorExpressionOptions,
};

export type {
  ClassAttributeExpressionOptions,
};
