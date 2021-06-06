import type { HtmlElementValues } from "./types";

/**
 * Build a syntactically valid HTML element from a collection of values.
 *
 * If no `tags` is provided the tag will be "div". For all other values the
 * default is an empty string.
 *
 * @param elementValues The values to construct a HTML element from.
 * @returns A HTML element as a string.
 */
export function buildHtmlElement(
  elementValues: HtmlElementValues,
): string {
  const {
    beforeOpeningTag = "",
    tag = "div",
    attributes = "",
    afterOpeningTag = "",
    content = "",
    beforeClosingTag = "",
    afterClosingTag = "",
  } = elementValues;

  const _attributes = attributes ? ` ${attributes}` : "";

  if (content === "") {
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
