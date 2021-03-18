import type { MangleExpression } from "../../types";

import {
  ATTRIBUTE_SELECTOR_PRE,
  ATTRIBUTE_SELECTOR_POST,
  ATTRIBUTE_USAGE_PRE,
  ATTRIBUTE_USAGE_POST,
} from "../common";
import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

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
      (?<!"[^"}]*|'[^'}]*)
      (?<=${ATTRIBUTE_SELECTOR_PRE})
      (?<${GROUP_MAIN}>%s)
      (?=${ATTRIBUTE_SELECTOR_POST})
    `,
    GROUP_MAIN,
  );
}

/**
 * Get a {@link MangleExpression} to match attribute usage in CSS, e.g.
 * `data-foo` in `content: attr(data-foo);`.
 *
 * @returns The {@link MangleExpression} to match attribute usage in CSS.
 */
function newAttributeUsageExpression(): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?<!"[^";]*|'[^';]*)
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
 */
export default function attributeExpressionFactory(): MangleExpression[] {
  return [
    newAttributeSelectorExpression(),
    newAttributeUsageExpression(),
  ];
}
