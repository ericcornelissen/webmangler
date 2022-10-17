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
  "beforeRuleset" |
  "beforeSelector" |
  "selector" |
  "afterSelector" |
  "declarations" |
  "afterRuleset";

/**
 * Type representing the values for the different parts of a CSS declaration.
 */
type CssDeclarationValues = TestValues<CssDeclarationKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * a CSS declaration.
 */
type CssDeclarationValuesSets = TestValuesSets<CssDeclarationKey>;

/**
 * Type representing the values for the different parts of a CSS ruleset.
 */
type CssRulesetValues = TestValues<CssRulesetKey>;

/**
 * Type representing a collection of possible values for the different parts of
 * a CSS ruleset.
 */
type CssRulesetValuesSets = TestValuesSets<CssRulesetKey>;

/**
 * Type representing a preset of values for the different parts of a CSS
 * document.
 */
type CssValuesPresets = TestValuesPresets<CssDeclarationKey | CssRulesetKey>;

export type {
  CssValuesPresets,
  CssRulesetValuesSets,
  CssRulesetValues,
  CssDeclarationValues,
  CssDeclarationValuesSets,
};
