import type { HtmlAttributeValues, HtmlElementValues } from "./types";

const DEFAULT_ATTRIBUTE_NAME = "alt";
const DEFAULT_ELEMENT_TAG = "div";

/**
 * Build HTML attributes from a name-value pair.
 *
 * If no `name` is provided the name will be "alt". If no `value` is provided
 * this function will produce valueless attributes (and ignore `beforeValue` and
 * `afterValue`). For all other values the default is an empty string.
 *
 * @param attributeValues The values to construct a HTML attribute from.
 * @returns A list of attribute-value strings.
 */
export function buildHtmlAttributes(
  attributeValues: HtmlAttributeValues,
): string[] {
  const {
    beforeName = "",
    name = DEFAULT_ATTRIBUTE_NAME,
    afterName = "",
    beforeValue = "",
    value,
    afterValue = "",
  } = attributeValues;

  if (value === undefined) {
    return [
      `${beforeName}${name}${afterName}`,
    ];
  } else {
    const result = [
      `${beforeName}${name}${afterName}=${beforeValue}"${value}"${afterValue}`,
      `${beforeName}${name}${afterName}=${beforeValue}'${value}'${afterValue}`,
    ];

    if (!/\s/.test(value)) {
      result.push(
        `${beforeName}${name}${afterName}=${beforeValue}${value}${afterValue}`,
      );
    }

    return result;
  }
}

/**
 * Build HTML comments from a string.
 *
 * @example
 * const comments = buildHtmlComments("foobar");
 * console.log(comments.length > 0);  // true;
 * console.log(comments[0]);  // "<!--foobar-->";
 * @param commentText The comment text.
 * @returns The text as various HTML comments.
 */
export function buildHtmlComments(commentText: string): string[] {
  return [
    `<!--${commentText}-->`,
    `<!-- \n ${commentText}-->`,
  ];
}

/**
 * Build a syntactically valid HTML element from a collection of values.
 *
 * If no `tag` is provided the tag will be "div". If no `content` is provided
 * this function will produce a self-closing tag (and ignore the `beforeClosing
 * Tag` and `afterClosingTag` values). For all other values the default is an
 * empty string.
 *
 * @param elementValues The values to construct a HTML element from.
 * @returns A HTML element as a string.
 */
export function buildHtmlElement(
  elementValues: HtmlElementValues,
): string {
  const {
    beforeOpeningTag = "",
    tag = DEFAULT_ELEMENT_TAG,
    attributes = "",
    afterOpeningTag = "",
    content,
    beforeClosingTag = "",
    afterClosingTag = "",
  } = elementValues;

  const _attributes = attributes ? ` ${attributes}` : "";

  if (content === undefined) {
    return beforeOpeningTag +
      "<" +
      tag +
      _attributes +
      "/>" +
      afterOpeningTag;
  } else {
    return beforeOpeningTag +
      "<" +
      tag +
      _attributes +
      ">" +
      afterOpeningTag +
      content +
      beforeClosingTag +
      "</" +
      tag +
      ">" +
      afterClosingTag;
  }
}

/**
 * Build syntactically valid HTML elements from a list of collections of values.
 * One HTML element is created for each collection of values.
 *
 * @param elementsValues Zero or more {@link HtmlElementValues}.
 * @returns A string of HTML elements.
 */
export function buildHtmlElements(
  elementsValues: Iterable<HtmlElementValues>,
): string {
  let document = "";
  for (const values of elementsValues) {
    document += buildHtmlElement(values);
  }

  return document;
}
