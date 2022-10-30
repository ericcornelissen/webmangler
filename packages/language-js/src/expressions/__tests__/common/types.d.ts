import type {
  TestValues,
  TestValuesPresets,
  TestValuesSets,
} from "@webmangler/testing";

type JsFunctionKey =
  "beforeName" |
  "name" |
  "afterName" |
  "beforeArgs" |
  "args" |
  "afterArgs" |
  "afterFunction";

type JsStatementKey =
  "beforeStatement" |
  "beforeLeftHand" |
  "leftHand" |
  "afterLeftHand" |
  "beforeRightHand" |
  "rightHand" |
  "afterRightHand" |
  "afterStatement";

/**
 * Type representing the values for the different parts of a JavaScript
 * function.
 */
type JsFunctionValues = TestValues<JsFunctionKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * a JavaScript function.
 */
type JsFunctionValuesSets = TestValuesSets<JsFunctionKey>;

/**
 * Type representing a preset of values for the different parts of a JavaScript
 * function.
 */
type JsFunctionValuesPresets = TestValuesPresets<JsFunctionKey>;

/**
 * Type representing the values for the different parts of a JavaScript
 * statement.
 */
type JsStatementValues = TestValues<JsStatementKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * a JavaScript statement.
 */
type JsStatementValuesSets = TestValuesSets<JsStatementKey>;

/**
 * Type representing a preset of values for the different parts of a JavaScript
 * statement.
 */
type JsStatementValuesPresets = TestValuesPresets<JsStatementKey>;

export type {
  JsFunctionValues,
  JsFunctionValuesPresets,
  JsFunctionValuesSets,
  JsStatementValues,
  JsStatementValuesPresets,
  JsStatementValuesSets,
};
