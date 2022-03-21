import type {
  MangleExpression,
  SingleValueAttributeOptions,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns, QUOTED_ATTRIBUTE_PATTERN } from "./common";

const GROUP_QUOTE = "quote";

/**
 * Get a {@link MangleExpression} to match quoted element attribute values in
 * HTML, e.g. `bar` in `<div data-foo="bar"></div>` or `sun` in `<div data-
 * praise="thesun"></div>` if the value prefix is "the".
 *
 * @param attributesPattern The pattern of attribute names.
 * @param valuePrefix An pattern of the required prefix for values.
 * @param valueSuffix An pattern of the required suffix for values.
 * @returns The {@link MangleExpression}s to match quoted attribute values.
 */
function newQuotedValueExpressions(
  attributesPattern: string,
  valuePrefix: string,
  valueSuffix: string,
): Iterable<MangleExpression> {
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
            ${valuePrefix}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${valueSuffix}
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
 * @param attributesPattern The pattern of attribute names.
 * @param valuePrefix An pattern of the required prefix for values.
 * @param valueSuffix An pattern of the required suffix for values.
 * @returns The {@link MangleExpression}s to match unquoted attribute values.
 */
function newUnquotedValueExpressions(
  attributesPattern: string,
  valuePrefix: string,
  valueSuffix: string,
): Iterable<MangleExpression> {
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
            ${valuePrefix}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${valueSuffix}
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
 * @since v0.1.14
 * @version v0.1.27
 */
function singleValueAttributeExpressionFactory(
  options: SingleValueAttributeOptions,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(options.attributeNames).join("|");
  const valuePrefix = options.valuePrefix ? options.valuePrefix : "";
  const valueSuffix = options.valueSuffix ? options.valueSuffix : "";

  return [
    ...newQuotedValueExpressions(attributesPattern, valuePrefix, valueSuffix),
    ...newUnquotedValueExpressions(attributesPattern, valuePrefix, valueSuffix),
  ];
}

export default singleValueAttributeExpressionFactory;
