import type {
  MangleExpression,
  MultiValueAttributeOptions,
} from "@webmangler/types";

import {
  NestedGroupMangleExpression,
  SingleGroupMangleExpression,
} from "@webmangler/language-utils";
import { patterns, QUOTED_ATTRIBUTE_PATTERN, QUOTES_ARRAY } from "./common";

/**
 * Get {@link MangleExpression}s to match element attribute values in HTML, e.g.
 * `the` and `sun` in `<img data-praise="the sun">`.
 *
 * @param attributesPattern The pattern of attribute names.
 * @returns The {@link MangleExpression}s to match attribute values in HTML.
 */
function newElementAttributeMultiValueExpressions(
  attributesPattern: string,
): Iterable<MangleExpression> {
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
 * @param attributesPattern The pattern of attribute names.
 * @returns The {@link MangleExpression}s to match unquoted attribute values.
 */
function newUnquotedAttributeValueExpressions(
  attributesPattern: string,
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
 * @since v0.1.14
 * @version v0.1.27
 */
function multiValueAttributeExpressionFactory(
  options: MultiValueAttributeOptions,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(options.attributeNames).join("|");

  return [
    ...newElementAttributeMultiValueExpressions(attributesPattern),
    ...newUnquotedAttributeValueExpressions(attributesPattern),
  ];
}

export default multiValueAttributeExpressionFactory;
