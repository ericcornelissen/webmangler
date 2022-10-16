import type { CssValuesPresets } from "./types";

/**
 * A list of valid CSS attribute selectors.
 */
const attributeSelectors: string[] = [
  "[href]",
  "[target=\"_blank\"]",
  "[rel='noopener']",
];

/**
 * A list of valid CSS class selectors.
 *
 * Every selector name is prefixed with a `_` so that a test scenario for class
 * selectors can avoid matching these selectors by requiring the first character
 * of the class name to not be a `_`.
 */
const classSelectors: string[] = [
  "._foo",
  "._bar",
];

/**
 * A list of valid CSS comments.
 */
const comments: string[] = [
  "/**/",
  "/* */",
  "/* foobar */",
  "/* .foo{content:'bar';} */",
  "/* \n */",
];

/**
 * A list of strings of one or more valid CSS declarations.
 */
const declarations: string[] = [
  "color: red;",
  "margin: 3px 14px;",
  "font-family: serif; font-weight: bold;",
  "box-sizing: border-box !important;",
];

/**
 * A list of valid CSS id selectors.
 *
 * Every selector name is prefixed with a `_` so that a test scenario for id
 * selectors can avoid matching these selectors by requiring the first character
 * of the id name to not be a `_`.
 */
const idSelectors: string[] = [
  "#_foo",
  "#_bar",
];

/**
 * A list of the `!important` rule with various whitespace.
 */
const importantRule: string[] = [
  "!important",
  "!important ",
  " !important",
  " !important ",
];

/**
 * A list of valid CSS media queries.
 */
const mediaQueries: string[] = [
  "@media only screen and (max-width: 1080px)",
  "@media not print and (min-width: 1920px)",
  "@media (orientation: portrait)",
];

/**
 * A list of valid CSS property names.
 */
const propertyNames: string[] = [
  "color",
  "font",
  "--var",
];

/**
 * A list of standard CSS pseudo element selectors.
 */
const pseudoElementSelectors: string[] = [
  "::after",
  "::before",
  "::placeholder",
  "::selection",
];

/**
 * A list of standard CSS pseudo selectors.
 */
const pseudoSelectors: string[] = [
  ":active",
  ":first-of-type",
  ":hover",
  ":valid",
];

/**
 * A list of CSS type selectors for standard HTML elements.
 */
const typeSelectors: string[] = [
  "div",
  "span",
];

/**
 * A list of valid CSS values.
 */
const values: string[] = [
  "red",
  "3px 14px",
  "var(--foobar)",
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
 * The full list of CSS attribute selector operators.
 */
const attributeSelectorOperators: string[] = [
  "=",
  "~=",
  "|=",
  "^=",
  "$=",
  "*=",
];

/**
 * The full list of CSS selector combinators.
 */
const selectorCombinators: string[] = [
  ...whitespace.filter((s) => s !== ""),
  ",",
  ">",
  "+",
  "~",
  " ,",
  " >",
  " +",
  " ~",
  ", ",
  "> ",
  "+ ",
  "~ ",
  " , ",
  " > ",
  " + ",
  " ~ ",
];

/**
 * A collection of sample values for testing the CSS language plugin.
 */
const sampleValues = {
  attributeSelectors,
  classSelectors,
  comments,
  declarations,
  idSelectors,
  importantRule,
  mediaQueries,
  propertyNames,
  pseudoElementSelectors,
  pseudoSelectors,
  typeSelectors,
  values,
  whitespace,
};

/**
 * A collection of preset values for testing the CSS language plugin.
 */
const valuePresets: CssValuesPresets = {
  beforeRuleset: new Set(),
  beforeSelector: new Set([
    ...comments,
    ...whitespace,
    ...selectorCombinators.map((combinator) => `._foobar${combinator}`),
  ]),
  selector: new Set([
    ...attributeSelectors,
    ...classSelectors,
    ...idSelectors,
    ...typeSelectors,
  ]),
  afterSelector: new Set([
    ...classSelectors,
    ...comments,
    ...idSelectors,
    ...pseudoElementSelectors,
    ...pseudoSelectors,
    ...selectorCombinators.map((combinator) => `${combinator}._foobar`),
    ...whitespace,
  ]),
  declarations: new Set([
    ...comments,
    ...declarations,
    ...whitespace,
  ]),
  beforeProperty: new Set([
    ...comments,
    ...whitespace,
  ]),
  property: new Set([
    ...propertyNames,
  ]),
  afterProperty: new Set([
    ...comments,
    ...whitespace,
  ]),
  beforeValue: new Set([
    ...comments,
    ...whitespace,
  ]),
  value: new Set([
    ...values,
  ]),
  afterValue: new Set([
    ...comments,
    ...importantRule,
    ...whitespace,
  ]),
  afterRuleset: new Set(),
};

export {
  attributeSelectorOperators,
  sampleValues,
  selectorCombinators,
  valuePresets,
};
