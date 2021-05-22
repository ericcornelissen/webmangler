/**
 * A collection of valid CSS comments.
 */
export const comments: Iterable<string> = [
  "/**/",
  "/* */",
  "/* foo */",
];

/**
 * A collection of the `!important` rule with various whitespace.
 */
export const importantRule: Iterable<string> = [
  "!important",
  "!important ",
  " !important",
  " !important ",
];

/**
 * A collection of valid CSS property names.
 */
export const propertyNames: Iterable<string> = [
  "color",
  "font",
  "--var",
];

/**
 * A collection of valid whitespace.
 */
export const whitespace: Iterable<string> = [
  "",
  " ",
  "\t",
  "\n",
  "\r\n",
];
