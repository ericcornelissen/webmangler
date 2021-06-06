import type {
  TestValues,
  TestValuesPresets,
  TestValuesSets,
} from "@webmangler/testing";

type CssDeclarationKey =
  "beforeProperty" |
  "property" |
  "afterProperty" |
  "beforeValue" |
  "value" |
  "afterValue";

type CssRulesetKey =
  "beforeSelector" |
  "selector" |
  "afterSelector" |
  "declarations";

/**
 * Type representing the values for the different parts of a CSS declaration.
 */
export type CssDeclarationValues = TestValues<CssDeclarationKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * a CSS declaration.
 */
export type CssDeclarationValuesSets = TestValuesSets<CssDeclarationKey>;

/**
 * Type representing the values for the different parts of a CSS ruleset.
 */
export type CssRulesetValues = TestValues<CssRulesetKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * a CSS ruleset.
 */
export type CssRulesetValuesSets = TestValuesSets<CssRulesetKey>;

/**
 * Type representing a preset of values for the different parts of a CSS
 * document.
 */
export type CssValuesPresets =
  TestValuesPresets<CssDeclarationKey | CssRulesetKey>;
