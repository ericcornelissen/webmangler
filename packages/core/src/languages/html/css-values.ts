import type { MangleExpression } from "../../types";
import type { CssDeclarationValueOptions } from "../options";

import { NestedGroupExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match the value of CSS declarations in HTML,
 * e.g. `serif` in `<div style="font: serif"><div>"`.
 *
 * @param prefix The prefix required on values.
 * @param suffix The suffix required on values.
 * @returns The {@link MangleExpression}s to match values in style attributes.
 */
function newStyleDeclarationValueExpressions(
  prefix: string,
  suffix: string,
): MangleExpression[] {
  return ["\"", "'"].map((quote) => new NestedGroupExpression(
    `
      (?<=
        \\s
        style
        \\s*=\\s*
        ${quote}
        \\s*
      )
      (?<${GROUP_MAIN}>
        [^${quote}]+
        :\\s*
        ${prefix}
        %s
        ${suffix}
        (?:\\s*\\;[^${quote}]*)?
      )
      (?=\\s*${quote})
    `,
    `
      (?<=
        :\\s*
        ${prefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${suffix}
        \\s*(;|$)
      )
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get the set of {@link MangleExpression}s to match the values of CSS
 * declarations in CSS. This will match:
 * - Values in style attributes (e.g. `bar` in `<img style="foo: bar">`).
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
    ...newStyleDeclarationValueExpressions(prefix, suffix),
  ];
}
