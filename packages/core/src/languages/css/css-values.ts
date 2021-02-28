import type { MangleExpression } from "../../types";
import type { CssDeclarationValueOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match the value of CSS declarations in CSS,
 * e.g. `serif` in `div { font: serif; }`.
 *
 * @param prefix The prefix required on values.
 * @param suffix The suffix required on values.
 * @returns The {@link MangleExpression} to match declaration values in CSS.
 */
function newCssDeclarationValueExpression(
  prefix: string,
  suffix: string,
): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?<!"[^";]*|'[^';]*)
      (?<=
        \\:\\s*
        ${prefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${suffix}
        \\s*(?:\\;|\\})
      )
    `,
    GROUP_MAIN,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match the values of CSS
 * declarations in CSS. This will match:
 * - Values as part of a CSS declaration (e.g. `bar` in `div { foo: bar }`).
 *
 * @param options The {@link CssDeclarationValueOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function cssDeclarationValueExpressionFactory(
  options: CssDeclarationValueOptions,
): MangleExpression[] {
  const prefix = options.prefix ? options.prefix : "";
  const suffix = options.suffix ? options.suffix : "";

  return [
    newCssDeclarationValueExpression(prefix, suffix),
  ];
}
