import type {
  TestValues,
  TestValuesPresets,
  TestValuesSets,
} from "@webmangler/testing";

type HtmlAttributeKey =
  "beforeName" |
  "name" |
  "afterName" |
  "beforeValue" |
  "value" |
  "afterValue";

type HtmlElementKey =
  "beforeOpeningTag" |
  "tag" |
  "attributes" |
  "afterOpeningTag" |
  "content" |
  "beforeClosingTag" |
  "afterClosingTag";

/**
 * Type representing the values for the different parts of an HTML attribute.
 */
type HtmlAttributeValues = TestValues<HtmlAttributeKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * an HTML attribute.
 */
type HtmlAttributeValuesSets = TestValuesSets<HtmlAttributeKey>;

/**
 * Type representing a preset of values for the different parts of an HTML
 * attribute.
 */
type HtmlAttributeValuesPresets = TestValuesPresets<HtmlAttributeKey>;

/**
 * Type representing the values for the different parts of an HTML element.
 */
type HtmlElementValues = TestValues<HtmlElementKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * an HTML element.
 */
type HtmlElementValuesSets = TestValuesSets<HtmlElementKey>;

/**
 * Type representing a preset of values for the different parts of an HTML
 * element.
 */
type HtmlElementValuesPresets = TestValuesPresets<HtmlElementKey>;

export type {
  HtmlAttributeValues,
  HtmlAttributeValuesSets,
  HtmlAttributeValuesPresets,
  HtmlElementValues,
  HtmlElementValuesSets,
  HtmlElementValuesPresets,
};
