import type { MangleExpression } from "../../types";
import type { CssDeclarationPropertyOptions } from "../options";

import { SingleGroupMangleExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match the property of CSS declarations in
 * CSS, e.g. `font` in `div { font: serif; }`.
 *
 * @param propertyPrefix The prefix required on properties.
 * @param propertySuffix The suffix required on properties.
 * @returns The {@link MangleExpression} to match declaration properties in CSS.
 */
function newCssDeclarationPropertyExpression(
  propertyPrefix: string,
  propertySuffix: string,
): MangleExpression {
  return new SingleGroupMangleExpression(
    `
      (?<=
        (?:\\;|\\{)\\s*
        ${propertyPrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${propertySuffix}
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
 * @version v0.1.18
 */
export default function cssDeclarationPropertyExpressionFactory(
  options: CssDeclarationPropertyOptions,
): Iterable<MangleExpression> {
  const propertyPrefix = options.prefix ? options.prefix : "";
  const propertySuffix = options.suffix ? options.suffix : "";

  return [
    newCssDeclarationPropertyExpression(propertyPrefix, propertySuffix),
  ];
}
