/**
 * A list of all CSS attribute selector operators.
 */
export const ATTRIBUTE_SELECTOR_OPERATORS: string[] = [
  "=",
  "~=",
  "|=",
  "^=",
  "$=",
  "*=",
];

/**
 * A list of various CSS attribute selectors. The surrounding square brackets
 * (`[` and `]`) are not included.
 *
 * This list includes at least one of each of the following:
 * - has attribute (`[attr]`)
 * - has data attribute (`[data-attr]`)
 * - has attribute with exact value (`[attr=val]`)
 * - has attribute containing value as word (`[attr~=val]`)
 * - has attribute with a hyphen-separated list of values beginning, from the
 *   left, with value (`[attr^=val]`)
 * - has attribute starting with value (`[attr^=val]`)
 * - has attribute ending with value (`[attr$=val]`)
 * - has attribute containing value (`[attr*=val]`)
 * - has attribute matching value, case insensitive (`[attr=val i]`)
 * - has attribute matching value, case sensitive (`[attr=val s]`)
 */
export const ATTRIBUTE_SELECTORS: string[] = [
  "disabled",
  "data-foobar",
  "target=\"_blank\"",
  "title~=\"foo\"",
  "lang|=\"en-US\"",
  "href^=\"https\"",
  "href$=\".pdf\"",
  "href*=\"bar\"",
  "data-foo=\"bar\" i",
  "data-foo=\"bar\" I",
  "data-hello=\"wOrLd\" s",
  "data-hello=\"wOrLd\" S",
];

/**
 * A list of various CSS properties.
 */
export const CSS_PROPERTIES = [
  "background",
  "color",
  "font",
  "margin-top",
  "-moz-box-align",
  "-webkit-box-align",
];

/**
 * A list of various CSS values. None of these are strings.
 */
export const CSS_VALUES_NO_STRINGS: string[] = [
  "#000",
  "#ABCDEF",
  "12px",
  "black",
  "serif",
];

/**
 * A list of various CSS values.
 */
export const CSS_VALUES: string[] = [
  ...CSS_VALUES_NO_STRINGS,
  "\"foo\"",
  "'bar'",
];

/**
 * A list of all standard pseudo element selectors. The "::"-prefix is not
 * included.
 */
export const PSEUDO_ELEMENT_SELECTORS: string[] = [
  "after",
  "before",
  "placeholder",
  "selection",
];

/**
 * A list of all standard pseudo selectors, except `:root`. The ":"-prefix is
 * not included.
 */
export const PSEUDO_SELECTORS: string[] = [
  "active",
  "checked",
  "default",
  "disabled",
  "empty",
  "enabled",
  "first-child",
  "first-of-type",
  "focus",
  "fullscreen",
  "hover",
  "in-range",
  "intermediate",
  "invalid",
  "lang(language)",
  "last-child",
  "last-of-type",
  "link",
  "not(selector)",
  "nth-child(2)",
  "nth-last-child(2)",
  "nth-last-of-type(2)",
  "only-of-type",
  "only-child",
  "optional",
  "out-of-range",
  "read-only",
  "read-write",
  "required",
  "target",
  "valid",
  "visited",
];

/**
 * A list of all CSS selector combinators.
 */
export const SELECTOR_COMBINATORS: string[] = [
  ",",
  "",
  " ",
  ">",
  "+",
  "~",
];

/**
 * A list of all type or units for the `attr()` CSS function.
 *
 * Based on: https://developer.mozilla.org/en-US/docs/Web/CSS/attr()#values
 */
export const TYPE_OR_UNITS: string[] = [
  "string",
  "color",
  "url",
  "integer",
  "number",
  "length",
  "em",
  "ex",
  "px",
  "rem",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "mm",
  "cm",
  "in",
  "pt",
  "pc",
  "angle",
  "deg",
  "grad",
  "rad",
  "time",
  "s",
  "ms",
  "frequency",
  "Hz",
  "kHz",
  "%",
];
