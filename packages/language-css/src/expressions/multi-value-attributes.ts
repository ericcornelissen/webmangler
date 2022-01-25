import type {
  MangleExpression,
  MultiValueAttributeOptions,
} from "@webmangler/types";

import { NestedGroupMangleExpression } from "@webmangler/language-utils";
import { patterns, QUOTES_ARRAY } from "./common";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match multi-value attribute selector values
 * in CSS, e.g. 'foo' and `bar` in `[class="foo bar"] { }`.
 *
 * @param attributesPattern The pattern of attribute names.
 * @returns The {@link MangleExpression}s to match attribute values in CSS.
 */
function newAttributeSelectorMultiValueExpression(
  attributesPattern: string,
): Iterable<MangleExpression> {
  return [
    ...QUOTES_ARRAY.map((quote) => new NestedGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.anyString}|${patterns.comment})
          |
          (?:
            \\[\\s*
            (?:${attributesPattern})\\s*
            (?:${patterns.attributeOperators})\\s*
            ${quote}\\s*
          )
          (?<${GROUP_MAIN}>
            (?:[^${quote}]+\\s)?
            %s
            (?:\\s[^${quote}]+)?
          )
          (?:
            \\s*${quote}
            \\s*\\]
          )
        )
      `,
      subPatternTemplate: `
        (?<=^|\\s)
        (?<${GROUP_MAIN}>%s)
        (?=$|\\s)
      `,
      groupName: GROUP_MAIN,
    })),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match multi-value attribute
 * values in CSS. This will match:
 * - Attribute selector values (e.g. `foo` and `bar` in `[data="foo bar"] { }`).
 *
 * @param options The {@link MultiValueAttributeOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.28
 */
function multiValueAttributeExpressionFactory(
  options: MultiValueAttributeOptions,
): Iterable<MangleExpression> {
  const attributesPattern = Array.from(options.attributeNames).join("|");

  return [
    ...newAttributeSelectorMultiValueExpression(attributesPattern),
  ];
}

export default multiValueAttributeExpressionFactory;
