import type { HtmlValuesPresets } from "./types";

/**
 * A list of valid HTML attribute, with and without value.
 */
const attributes: string[] = [
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
 * A list of valid HTML comments.
 */
const comments: string[] = [
  "<!---->",
  "<!-- -->",
  "<!--foobar-->",
  "<!-- Hello world! -->",
];

/**
 * A list of valid HTML content.
 */
const content: string[] = [
  "",
  "Lorem ipsum dolor...",
];

/**
 * A list of standard HTML tags.
 */
const tags: string[] = [
  "div",
  "p",
  "body",
];

/**
 * A list of valid whitespace.
 */
const whitespace: string[] = [
  "",
  " ",
  "\t",
  "\n",
  "\r\n",
];

/**
 * A collection of sample values for testing the HTML language plugin.
 */
export const sampleValues = {
  attributes,
  comments,
  content,
  tags,
  whitespace,
};

/**
 * A collection of preset values for testing the HTML language plugin.
 */
export const valuePresets: HtmlValuesPresets = {
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
};
