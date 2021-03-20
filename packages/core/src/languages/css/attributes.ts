import type { MangleExpression } from "../../types";

import { ATTRIBUTE_USAGE_PRE,ATTRIBUTE_USAGE_POST } from "../common";
import { SingleGroupMangleExpression } from "../utils/mangle-expressions";
import { IN_A_BLOCK_NOT_A_STRING } from "./common";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match attribute usage in CSS, e.g.
 * `data-foo` in `content: attr(data-foo);`.
 *
 * @returns The {@link MangleExpression} to match attribute usage in CSS.
 */
function newAttributeUsageExpression(): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      ${IN_A_BLOCK_NOT_A_STRING}
      (?<=${ATTRIBUTE_USAGE_PRE})
      (?<${GROUP_MAIN}>%s)
      (?=${ATTRIBUTE_USAGE_POST})
    `,
    GROUP_MAIN,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match attributes in CSS. This
 * will match:
 * - Attribute selectors (e.g. `data-foo` in `[data-foo] { }`).
 * - Attribute usage (e.g. `data-foo` in `content: attr(data-foo);`).
 *
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.17
 */
export default function attributeExpressionFactory(): MangleExpression[] {
  return [
    newAttributeUsageExpression(),
  ];
}
