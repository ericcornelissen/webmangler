import type {
  MangleExpression,
  SingleValueAttributeOptions,
} from "@webmangler/types";

import { NestedGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

type SingleValueAttributeConfig = Required<SingleValueAttributeOptions>

const GROUP_QUOTE = "quote";

/**
 * Get a {@link MangleExpression} to match quoted attribute selector values in
 * CSS, e.g. `bar` in `[foo="bar"]` or `[foo='bar']` or, with the prefix value
 * "foo", `[data="foobar"]`.
 *
 * @param config The {@link SingleValueAttributeConfig}.
 * @returns The {@link MangleExpression}s to match quoted attribute values.
 */
function newAttributeSelectorQuotedSingleValueExpression(
  config: SingleValueAttributeConfig,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(config.attributeNames).join("|");

  return [
    new NestedGroupMangleExpression({
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
          ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "", after: "" })}
          (?:
            ${config.valueSuffix}
            \\s*\\k<${GROUP_QUOTE}>
            \\s*\\]
          )
        )
      `,
      subPatternTemplate: `
        ^
        ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
        $
      `,
    }),
  ];
}

/**
 * Get a {@link MangleExpression} to match unquoted attribute selector values in
 * CSS, e.g. `bar` in `[foo=bar]` or, with the prefix value "foo",
 * `[data=foobar]`.
 *
 * @param config The {@link SingleValueAttributeConfig}.
 * @returns The {@link MangleExpression}s to match unquoted attribute values.
 */
function newAttributeSelectorUnquotedSingleValueExpression(
  config: SingleValueAttributeConfig,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(config.attributeNames).join("|");

  return [
    new NestedGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.anyString}|${patterns.comment}|${patterns.ruleset})
          |
          (?:
            \\[\\s*
            (?:${attributesPattern})\\s*
            (?:${patterns.attributeOperators})\\s*
            ${config.valuePrefix}
          )
          ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "", after: "" })}
          (?:
            ${config.valueSuffix}
            \\s*\\]
          )
        )
      `,
      subPatternTemplate: `
        ^
        ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
        $
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match single-value attribute
 * values in CSS. This will match:
 * - Double quoted attribute selector values (e.g. `bar` in `[foo="bar"] { }`).
 * - Single quoted attribute selector values (e.g. `bar` in `[foo='bar'] { }`).
 * - Unquoted attribute selector values (e.g. `bar` in `[foo=bar] { }`).
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
    ...newAttributeSelectorQuotedSingleValueExpression(config),
    ...newAttributeSelectorUnquotedSingleValueExpression(config),
  ];
}

export default singleValueAttributeExpressionFactory;
