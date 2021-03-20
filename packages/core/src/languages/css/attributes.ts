import type { MangleExpression } from "../../types";

import { ATTRIBUTE_SELECTOR_PRE, ATTRIBUTE_SELECTOR_POST } from "../common";
import { SingleGroupMangleExpression } from "../utils/mangle-expressions";
import { NOT_IN_A_BLOCK_OR_STRING } from "./common";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match attribute selectors in CSS, e.g.
 * `data-foo` in `[data-foo] { }`.
 *
 * @returns The {@link MangleExpression} to match attribute selectors in CSS.
 */
function newAttributeSelectorExpression(): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      ${NOT_IN_A_BLOCK_OR_STRING}
      (?<=${ATTRIBUTE_SELECTOR_PRE})
      (?<${GROUP_MAIN}>%s)
      (?=${ATTRIBUTE_SELECTOR_POST})
    `,
    GROUP_MAIN,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match attributes in CSS. This
 * will match:
 * - Attribute selectors (e.g. `data-foo` in `[data-foo] { }`).
 *
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function attributeExpressionFactory(): MangleExpression[] {
  return [
    newAttributeSelectorExpression(),
  ];
}
