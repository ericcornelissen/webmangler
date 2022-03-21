import type {
  AttributeOptions,
  MangleExpression,
} from "@webmangler/types";

import { NestedGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

/**
 * Get {@link MangleExpression}s to match attributes in HTML, e.g. `data-foo` in
 * `<div data-foo="bar"></div>`.
 *
 * @returns The {@link MangleExpression}s to match element attributes in HTML.
 */
function newElementAttributeExpressions(): Iterable<MangleExpression> {
  const captureGroup = NestedGroupMangleExpression.CAPTURE_GROUP({
    before: `(?:${patterns.attributes})?`,
    after: "",
  });

  return [
    new NestedGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment}|${patterns.anyString})
          |
          (?<=${patterns.tagOpen})
          ${captureGroup}
          (?=${patterns.afterAttributeName})
        )
      `,
      subPatternTemplate: `
        (?:
          (?:${patterns.anyString})
          |
          (?<=\\s|^)
          ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
          (?=${patterns.afterAttributeName}|$)
        )
      `,
      caseSensitive: false,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match attributes in HTML. This
 * will match:
 * - Element attributes (e.g. `data-foo` in `<div data-foo="bar"></div>`).
 *
 * @param options The {@link AttributeOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.27
 */
function attributeExpressionFactory(
  options: AttributeOptions, // eslint-disable-line @typescript-eslint/no-unused-vars
): Iterable<MangleExpression> {
  return [
    ...newElementAttributeExpressions(),
  ];
}

export default attributeExpressionFactory;
