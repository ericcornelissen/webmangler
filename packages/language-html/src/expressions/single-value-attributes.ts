import type {
  MangleExpression,
  SingleValueAttributeOptions,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns, QUOTED_ATTRIBUTE_PATTERN } from "./common";

type SingleValueAttributeConfig = Required<SingleValueAttributeOptions>;

const GROUP_QUOTE = "quote";

/**
 * Get a {@link MangleExpression} to match quoted element attribute values in
 * HTML, e.g. `bar` in `<div data-foo="bar"></div>` or `sun` in `<div data-
 * praise="thesun"></div>` if the value prefix is "the".
 *
 * @param config The {@link SingleValueAttributeConfig}.
 * @returns The {@link MangleExpression}s to match quoted attribute values.
 */
function newQuotedValueExpressions(
  config: SingleValueAttributeConfig,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(config.attributeNames).join("|");
  const quoteExpr = `(?<${GROUP_QUOTE}>${patterns.quotes})`;
  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            ${patterns.tagOpen}
            (?:${patterns.attributes})?
            ${QUOTED_ATTRIBUTE_PATTERN(attributesPattern, quoteExpr)}
            ${config.valuePrefix}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${config.valueSuffix}
            \\s*\\k<${GROUP_QUOTE}>
            [^>]*
            >
          )
        )
      `,
    }),
  ];
}

/**
 * Get a {@link MangleExpression} to match unquoted element attribute values in
 * HTML, e.g. `bar` in `<div data-foo=bar></div>` or `sun` in `<div data-
 * praise=thesun></div>` if the value prefix is "the".
 *
 * @param config The {@link SingleValueAttributeConfig}.
 * @returns The {@link MangleExpression}s to match unquoted attribute values.
 */
function newUnquotedValueExpressions(
  config: SingleValueAttributeConfig,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(config.attributeNames).join("|");
  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            ${patterns.tagOpen}
            (?:${patterns.attributes})?
            (?:${attributesPattern})
            \\s*=\\s*
            ${config.valuePrefix}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${config.valueSuffix}
            ${patterns.afterAttribute}
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match single-value attribute
 * values in HTML. This will match:
 * - Quoted attribute values (e.g. `bar` in `<div data-foo="bar"></div>`).
 * - Unquoted attribute values (e.g. `bar` in `<div data-foo=bar></div>`).
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
    ...newQuotedValueExpressions(config),
    ...newUnquotedValueExpressions(config),
  ];
}

export default singleValueAttributeExpressionFactory;
