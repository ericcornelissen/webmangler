import type {
  HtmlAttributeValuesPresets,
  HtmlElementValuesPresets,
} from "./types";

/**
 * A list of standard HTML attribute names.
 */
const attributeNames: ReadonlyArray<string> = [
  "id",
  "class",
  "data-value",
];

/**
 * A list of valid HTML attribute, with and without value.
 */
const attributes: ReadonlyArray<string> = [
  "disabled",
  "id=_foobar",
  "id=\"_foobar\"",
  "id='_foobar'",
  "class=\"_foo _bar\"",
  "class='_foo _bar'",
  "data-value",
  "data-value=_foobar",
  "data-value=\"_foobar\"",
  "data-value='_foobar'",
];

/**
 * A list of valid HTML attribute values.
 */
const attributeValues: ReadonlyArray<string> = [
  "foobar",
  "Hello world!",
];

/**
 * A list of valid HTML comments.
 */
const comments: ReadonlyArray<string> = [
  "<!---->",
  "<!-- -->",
  "<!--foobar-->",
  "<!-- Hello world! -->",
  "<!-- \n -->",
  "<!-- --!>",
];

/**
 * A list of valid HTML content. `undefined` is included to denote a self-
 * closing tag.
 */
const content: ReadonlyArray<(string | undefined)> = [
  undefined,
  "",
  "Lorem ipsum dolor...",
];

/**
 * A list of standard HTML tags.
 */
const tags: ReadonlyArray<string> = [
  "div",
  "p",
  "body",
];

/**
 * A list of valid whitespace.
 */
const whitespace: ReadonlyArray<string> = [
  "",
  " ",
  "\t",
  "\n",
  "\r\n",
];

/**
 * A collection of sample values for testing the HTML language plugin.
 */
const sampleValues = {
  attributeNames,
  attributes,
  attributeValues,
  comments,
  content,
  tags,
  whitespace,
};

/**
 * A collection of preset values for testing the HTML language plugin.
 */
const valuePresets: {
  attributes: HtmlAttributeValuesPresets;
  elements: HtmlElementValuesPresets;
} = {
  attributes: {
    beforeName: new Set([
      ...whitespace,
    ]),
    name: new Set([
      ...attributeNames,
    ]),
    afterName: new Set([
      ...whitespace,
    ]),
    beforeValue: new Set([
      ...whitespace,
    ]),
    value: new Set([
      ...attributeValues,
    ]),
    afterValue: new Set([
      ...whitespace,
    ]),
  },
  elements: {
    beforeOpeningTag: new Set([
      ...comments,
      ...whitespace,
    ]),
    tag: new Set([
      ...tags,
    ]),
    attributes: new Set([
      ...attributes,
      ...whitespace,
    ]),
    afterOpeningTag: new Set([
      ...comments,
      ...whitespace,
    ]),
    content: new Set([
      ...comments,
      ...content,
      ...whitespace,
    ]),
    beforeClosingTag: new Set([
      ...comments,
      ...whitespace,
    ]),
    afterClosingTag: new Set([
      ...comments,
      ...whitespace,
    ]),
  },
};

export {
  sampleValues,
  valuePresets,
};
