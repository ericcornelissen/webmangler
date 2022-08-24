import type {
  MangleExpression,
  SingleValueAttributeOptions,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

type SingleValueAttributeConfig = Required<SingleValueAttributeOptions>

const GROUP_QUOTE = "quote";

/**
 * Get a {@link MangleExpression} to match attribute selector values in CSS,
 * e.g. `bar` in `[data-foo="bar"] { }` or `sun` in `[data-praise="thesun"] { }`
 * if the value prefix is "the".
 *
 * @param config The {@link newAttributeSelectorSingleValueExpression}.
 * @returns The {@link MangleExpression}s to match attribute values in CSS.
 */
function newAttributeSelectorSingleValueExpression(
  config: SingleValueAttributeConfig,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(config.attributeNames).join("|");

  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.anyString}|${patterns.comment}|${patterns.ruleset})
          |
          (?:
            \\[\\s*
            (?:${attributesPattern})\\s*
            (?:${patterns.attributeOperators})\\s*
            (?<${GROUP_QUOTE}>${patterns.quotes})\\s*
            ${config.valuePrefix}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?:
            ${config.valueSuffix}
            \\s*\\k<${GROUP_QUOTE}>
            \\s*\\]
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match single-value attribute
 * values in CSS. This will match:
 * - Attribute selector values (e.g. `bar` in `[data-foo="bar"] { }`).
 *
 * @param options The {@link SingleValueAttributeOptions}.
 * @returns A set of {@link MangleExpression}s.
 */
function singleValueAttributeExpressionFactory(
  options: SingleValueAttributeOptions,
): Iterable<MangleExpression> {
  const config: SingleValueAttributeConfig = {
    attributeNames: options.attributeNames,
    valuePrefix: options.valuePrefix ? options.valuePrefix : "",
    valueSuffix: options.valueSuffix ? options.valueSuffix : "",
  };

  return [
    ...newAttributeSelectorSingleValueExpression(config),
  ];
}

export default singleValueAttributeExpressionFactory;
