import type {
  MangleExpression,
  MultiValueAttributeOptions,
} from "@webmangler/types";

import { NestedGroupMangleExpression } from "@webmangler/language-utils";
import { patterns, QUOTES_ARRAY } from "./common";

type MultiValueAttributeConfig = Required<MultiValueAttributeOptions>;

/**
 * Get {@link MangleExpression}s to match quoted multi-value attribute selector
 * values in CSS, e.g. 'foo' and `bar` in `[data="foo bar"]` or
 * `[data='foo bar']`.
 *
 * @param config The {@link MultiValueAttributeConfig}.
 * @returns The {@link MangleExpression}s to match quoted attribute values.
 */
function newAttributeSelectorQuotedMultiValueExpression(
  config: MultiValueAttributeConfig,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(config.attributeNames).join("|");

  return [
    ...QUOTES_ARRAY.map((quote) => {
      const captureGroup = NestedGroupMangleExpression.CAPTURE_GROUP({
        before: `(?:[^${quote}]+\\s)?`,
        after: `(?:\\s[^${quote}]+)?`,
      });

      return new NestedGroupMangleExpression({
        patternTemplate: `
          (?:
            (?:${patterns.anyString}|${patterns.comment}|${patterns.ruleset})
            |
            (?:
              \\[\\s*
              (?:${attributesPattern})\\s*
              (?:${patterns.attributeOperators})\\s*
              ${quote}\\s*
            )
            ${captureGroup}
            (?:
              \\s*${quote}
              \\s*\\]
            )
          )
        `,
        subPatternTemplate: `
          (?<=^|\\s)
          ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
          (?=$|\\s)
        `,
      });
    }),
  ];
}

/**
 * Get {@link MangleExpression}s to match unquoted multi-value attribute
 * selector values in CSS, e.g. 'foobar` in `[data=foobar] { }`.
 *
 * @param config The {@link MultiValueAttributeConfig}.
 * @returns The {@link MangleExpression}s to match unquoted attribute values.
 */
function newAttributeSelectorUnquotedMultiValueExpression(
  config: MultiValueAttributeConfig,
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
          )
          ${NestedGroupMangleExpression.CAPTURE_GROUP({ before: "", after: "" })}
          (?:
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
 * Get the set of {@link MangleExpression}s to match multi-value attribute
 * values in CSS. This will match:
 * - Double quoted attribute selector values (e.g. `foo` and `bar` in
 * `[data="foo bar"] { }`).
 * - Single quoted attribute selector values (e.g. `foo` and `bar` in
 * `[data='foo bar'] { }`).
 * - Unquoted attribute selector values (e.g. `foobar` in `[data=foobar] { }`).
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
    ...newAttributeSelectorQuotedMultiValueExpression(config),
    ...newAttributeSelectorUnquotedMultiValueExpression(config),
  ];
}

export default multiValueAttributeExpressionFactory;
