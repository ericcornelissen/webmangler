import type { CssDeclarationValues, CssRulesetValues } from "./types";

const DEFAULT_PROPERTY = "color";
const DEFAULT_SELECTOR = "div";
const DEFAULT_VALUE = "red";

/**
 * Build a syntactically valid CSS declaration from a collection of values.
 *
 * If no `property` is provided the property will be "color". If no `value` is
 * provided the value will be "red". For all other values the default is an
 * empty string.
 *
 * @param declarationValues The values to construct a CSS declaration from.
 * @returns One CSS declaration as a string.
 */
export function buildCssDeclaration(
  declarationValues: CssDeclarationValues,
): string {
  const {
    beforeProperty = "",
    property = DEFAULT_PROPERTY,
    afterProperty = "",
    beforeValue = "",
    value = DEFAULT_VALUE,
    afterValue = "",
  } = declarationValues;

  return beforeProperty +
    property +
    afterProperty +
    ":" +
    beforeValue +
    value +
    afterValue +
    ";";
}

/**
 * Build syntactically valid CSS declarations from a list of collections of
 * values. One CSS declaration is created for each collection of values.
 *
 * @param declarationsValues Zero or more {@link CssDeclarationValues}.
 * @returns A string of CSS declarations.
 */
export function buildCssDeclarations(
  declarationsValues: Iterable<CssDeclarationValues>,
): string {
  let declarations = "";
  for (const values of declarationsValues) {
    declarations += buildCssDeclaration(values);
  }

  return declarations;
}

/**
 * Build a syntactically valid CSS ruleset from a collection of values.
 *
 * If no `selector` is provided the selector will be "div". For all other values
 * the default is an empty string.
 *
 * @param rulesetValues The values to construct a CSS ruleset block from.
 * @returns A CSS ruleset as a string.
 */
export function buildCssRuleset(
  rulesetValues: CssRulesetValues,
): string {
  const {
    beforeRuleset = "",
    beforeSelector = "",
    selector = DEFAULT_SELECTOR,
    afterSelector = "",
    declarations = "",
    afterRuleset = "",
  } = rulesetValues;

  return beforeRuleset +
    beforeSelector +
    selector +
    afterSelector +
    "{" +
    declarations +
    "}" +
    afterRuleset;
}

/**
 * Build syntactically valid CSS rulesets from a list of collections of
 * values. One CSS ruleset is created for each collection of values.
 *
 * @param rulesetsValues Zero or more {@link CssRulesetValues}.
 * @returns A string of CSS rulesets.
 */
export function buildCssRulesets(
  rulesetsValues: Iterable<CssRulesetValues>,
): string {
  let rulesets = "";
  for (const values of rulesetsValues) {
    rulesets += buildCssRuleset(values);
  }

  return rulesets;
}
