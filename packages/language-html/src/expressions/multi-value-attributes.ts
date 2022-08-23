import type {
  MangleExpression,
  MultiValueAttributeOptions,
} from "@webmangler/types";

import {
  NestedGroupMangleExpression,
  SingleGroupMangleExpression,
} from "@webmangler/language-utils";
import { patterns, QUOTED_ATTRIBUTE_PATTERN, QUOTES_ARRAY } from "./common";

type MultiValueAttributeConfig = Required<MultiValueAttributeOptions>;

/**
 * Get {@link MangleExpression}s to match element attribute values in HTML, e.g.
 * `the` and `sun` in `<img data-praise="the sun">`.
 *
 * @param config The {@link MultiValueAttributeConfig}.
 * @returns The {@link MangleExpression}s to match attribute values in HTML.
 */
function newElementAttributeMultiValueExpressions(
  config: MultiValueAttributeConfig,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(config.attributeNames).join("|");

  return QUOTES_ARRAY.map((quote) => {
    const captureGroup = NestedGroupMangleExpression.CAPTURE_GROUP({
      before: `(?:[^${quote}]+\\s)?`,
      after: `(?:\\s[^${quote}]+)?`,
    });

    return new NestedGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            ${patterns.tagOpen}
            (?:${patterns.attributes})?
            ${QUOTED_ATTRIBUTE_PATTERN(attributesPattern, quote)}
          )
          ${captureGroup}
          (?=
            \\s*${quote}
            [^>]*
            >
          )
        )
      `,
      subPatternTemplate: `
        (?<=^|\\s)
        ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
        (?=$|\\s)
      `,
    });
  });
}

/**
 * Get {@link MangleExpression}s to match unquoted element attribute values in
 * HTML, e.g. `bar` in `<div data-foo=bar></div>`.
 *
 * @param config The {@link MultiValueAttributeConfig}.
 * @returns The {@link MangleExpression}s to match unquoted attribute values.
 */
function newUnquotedAttributeValueExpressions(
  config: MultiValueAttributeConfig,
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
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            (?:${patterns.afterAttribute})
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match multi-value attribute
 * values in HTML. This will match:
 * - Attribute values (e.g. `the` and `sun` in `<img data-praise="the sun">`).
 *
 * @param options The {@link MultiValueAttributeOptions}.
 * @returns A set of {@link MangleExpression}s.
 */
function multiValueAttributeExpressionFactory(
  options: MultiValueAttributeOptions,
): Iterable<MangleExpression> {
  const config: MultiValueAttributeConfig = {
    attributeNames: options.attributeNames,
  };

  return [
    ...newElementAttributeMultiValueExpressions(config),
    ...newUnquotedAttributeValueExpressions(config),
  ];
}

export default multiValueAttributeExpressionFactory;
