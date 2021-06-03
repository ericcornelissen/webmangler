/**
 * A collection of valid CSS comments.
 */
const comments: Iterable<string> = [
  "/**/",
  "/* */",
  "/* foo */",
];

/**
 * A collection of strings of one or more valid CSS declarations.
 */
const declarations: Iterable<string> = [
  "color: red;",
  "margin: 3px 14px;",
  "font-family: serif; font-weight: bold;",
  "box-sizing: border-box !important;",
];

/**
 * A collection of the `!important` rule with various whitespace.
 */
const importantRule: Iterable<string> = [
  "!important",
  "!important ",
  " !important",
  " !important ",
];

/**
 * A collection of valid CSS property names.
 */
const propertyNames: Iterable<string> = [
  "color",
  "font",
  "--var",
];

/**
 * A collection of valid CSS values.
 */
const values: Iterable<string> = [
  "red",
  "3px 14px",
  "var(--foobar)",
];

/**
 * A collection of valid whitespace.
 */
const whitespace: Iterable<string> = [
  "",
  " ",
  "\t",
  "\n",
  "\r\n",
];

/**
 * A collection of sample values for testing the CSS language plugin.
 */
export const sampleValues = {
  comments,
  declarations,
  importantRule,
  propertyNames,
  values,
  whitespace,
};

/**
 * A collection of preset values for testing the CSS language plugin.
 */
export const valuePresets = {
  beforeSelector: new Set([
    ...comments,
    ...whitespace,
  ]),
  afterSelector: new Set([
    ...comments,
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
};
