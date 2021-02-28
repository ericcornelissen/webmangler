import type { MangleExpression } from "../../types";
import type { CssDeclarationPropertyOptions } from "../options";

import { NestedGroupExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match the property of CSS declarations in
 * HTML, e.g. `font` in `<div style="font: serif"><div>"`.
 *
 * @param prefix The prefix required on properties.
 * @param suffix The suffix required on properties.
 * @returns The {@link MangleExpression}s to match properties in style attr.
 */
function newStyleDeclarationPropertyExpressions(
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
        (?:[^${quote}]+)?
        ${prefix}
        %s
        ${suffix}
        \\s*:
        (?:[^${quote}]+)?
      )
      (?=\\s*${quote})
    `,
    `
      (?<=
        (^|;)\\s*
        ${prefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${suffix}
        \\s*:
      )
    `,
    GROUP_MAIN,
  ));
}

/**
 * Get the set of {@link MangleExpression}s to match the properties of CSS
 * declarations in HTML. This will match:
 * - Properties in style attributes (e.g. `foo` in `<img style="foo: bar">`).
 *
 * @param options The {@link CssDeclarationPropertyOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 */
export default function cssDeclarationPropertyExpressionFactory(
  options: CssDeclarationPropertyOptions,
): MangleExpression[] {
  const prefix = options.prefix ? options.prefix : "";
  const suffix = options.suffix ? options.suffix : "";
  return [
    ...newStyleDeclarationPropertyExpressions(prefix, suffix),
  ];
}
