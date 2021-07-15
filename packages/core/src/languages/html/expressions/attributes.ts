import type { MangleExpression } from "../../../types";

import { NestedGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match attributes in HTML, e.g. `data-foo` in
 * `<div data-foo="bar"></div>`.
 *
 * @returns The {@link MangleExpression}s to match element attributes in HTML.
 */
function newElementAttributeExpressions(): Iterable<MangleExpression> {
  return [
    new NestedGroupMangleExpression(
      `
        (?:
          (?:${patterns.comment}|${patterns.anyString})
          |
          (?<=${patterns.tagOpen})
          (?<${GROUP_MAIN}>
            ${patterns.attributes}
            %s
          )
          (?=${patterns.afterAttributeName})
        )
      `,
      `
        (?:
          (?:${patterns.anyString})
          |
          (?<=\\s|^)
          (?<${GROUP_MAIN}>%s)
          (?=${patterns.afterAttributeName}|$)
        )
      `,
      GROUP_MAIN,
    ),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match attributes in HTML. This
 * will match:
 * - Element attributes (e.g. `data-foo` in `<div data-foo="bar"></div>`).
 *
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.23
 */
export default function attributeExpressionFactory():
    Iterable<MangleExpression> {
  return [
    ...newElementAttributeExpressions(),
  ];
}
