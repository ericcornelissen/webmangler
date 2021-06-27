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
export type JsFunctionValues = TestValues<JsFunctionKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * a JavaScript function.
 */
export type JsFunctionValuesSets = TestValuesSets<JsFunctionKey>;

/**
 * Type representing a preset of values for the different parts of a JavaScript
 * function.
 */
export type JsFunctionValuesPresets = TestValuesPresets<JsFunctionKey>;

/**
 * Type representing the values for the different parts of a JavaScript
 * statement.
 */
export type JsStatementValues = TestValues<JsStatementKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * a JavaScript statement.
 */
export type JsStatementValuesSets = TestValuesSets<JsStatementKey>;

/**
 * Type representing a preset of values for the different parts of a JavaScript
 * statement.
 */
export type JsStatementValuesPresets = TestValuesPresets<JsStatementKey>;
