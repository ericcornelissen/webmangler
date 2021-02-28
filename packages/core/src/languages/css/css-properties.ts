import type { MangleExpression } from "../../types";
import type { CssDeclarationPropertyOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match the property of CSS declarations in
 * CSS, e.g. `font` in `div { font: serif; }`.
 *
 * @param prefix The prefix required on properties.
 * @param suffix The suffix required on properties.
 * @returns The {@link MangleExpression} to match declaration properties in CSS.
 */
function newCssDeclarationPropertyExpression(
  prefix: string,
  suffix: string,
): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?<!"[^";]*|'[^';]*)
      (?<=
        (?:\\;|\\{)
        \\s*
        ${prefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${suffix}
        \\s*:
      )
    `,
    GROUP_MAIN,
  );
}

/**
 * Get the set of {@link MangleExpression}s to match the properties of CSS
 * declarations in CSS. This will match:
 * - Properties as part of a CSS declaration (e.g. `foo` in `div { foo: bar }`).
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
    newCssDeclarationPropertyExpression(prefix, suffix),
  ];
}
