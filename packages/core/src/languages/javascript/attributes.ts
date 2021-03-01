import type { MangleExpression } from "../../types";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";
const GROUP_QUOTE = "quote";

/**
 * Get {@link MangleExpression}s to match attribute selectors in JavaScript,
 * e.g. `data-foo` in `document.querySelectorAll("[data-foo]");`.
 *
 * @returns The {@link MangleExpression}s to match attribute selectors in JS.
 */
function newAttributeSelectorExpressions(): MangleExpression[] {
  return ["\"", "'", "`"].map((quote) => new SingleGroupMangleExpression(
    `
      (?<=
        ${quote}[^${quote}]*
        \\[\\s*
      )
      (?<${GROUP_MAIN}>%s)
      (?=\\s*(?:\\]|\\=|\\|=|\\~=|\\^=|\\$=|\\*=))
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get a {@link MangleExpression} to match attributes as standalone strings in
 * JavaScript, e.g. `data-foo` in `$element.getAttribute("data-foo");`.
 *
 * @returns The {@link MangleExpression} to match standalone attributes in JS.
 */
function newSelectorAsStandaloneStringExpression(): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?<=
        (?<${GROUP_QUOTE}>"|'|\`)
        \\s*
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        \\s*
        \\k<${GROUP_QUOTE}>
      )
    `,
    GROUP_MAIN,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match attributes in CSS. This
 * will match:
 * - Attribute selectors (e.g. `data-foo` in `querySelector("[data-foo]");`).
 * - Attribute manipulation (e.g. `data-foo` in `getAttribute("data-foo")`).
 *
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function attributeExpressionFactory(): MangleExpression[] {
  return [
    ...newAttributeSelectorExpressions(),
    newSelectorAsStandaloneStringExpression(),
  ];
}
