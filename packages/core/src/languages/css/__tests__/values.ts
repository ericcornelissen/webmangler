/**
 * A collection of valid CSS comments.
 */
const comments: Iterable<string> = [
  "/**/",
  "/* */",
  "/* foo */",
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
export const sampleValues: { [key: string]: Iterable<string> } = {
  comments,
  importantRule,
  propertyNames,
  values,
  whitespace,
};

/**
 * A collection of preset values for testing the CSS language plugin.
 */
export const valuePresets: { [key: string]: Iterable<string> } = {
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
