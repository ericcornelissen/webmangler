import type { MangleExpression } from "../../types";
import type { CssDeclarationPropertyOptions } from "../options";

import { NestedGroupExpression } from "../utils/mangle-expressions";

const GROUP_MAIN = "main";

/**
 * Get {@link MangleExpression}s to match the property of CSS declarations in
 * HTML, e.g. `font` in `<div style="font: serif"><div>"`.
 *
 * @param propertyPrefix The prefix required on properties.
 * @param propertySuffix The suffix required on properties.
 * @returns The {@link MangleExpression}s to match properties in style attr.
 */
function newStyleDeclarationPropertyExpressions(
  propertyPrefix: string,
  propertySuffix: string,
): MangleExpression[] {
  return ["\"", "'"].map((quote) => new NestedGroupExpression(
    `
      (?<=
        \\sstyle\\s*=\\s*
        ${quote}\\s*
      )
      (?<${GROUP_MAIN}>
        (?:[^${quote}]+)?
        ${propertyPrefix}
        %s
        ${propertySuffix}
        \\s*:
        (?:[^${quote}]+)?
      )
      (?=\\s*${quote})
    `,
    `
      (?<=
        (^|;)\\s*
        ${propertyPrefix}
      )
      (?<${GROUP_MAIN}>%s)
      (?=
        ${propertySuffix}
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
  const propertyPrefix = options.prefix ? options.prefix : "";
  const propertySuffix = options.suffix ? options.suffix : "";

  return [
    ...newStyleDeclarationPropertyExpressions(propertyPrefix, propertySuffix),
  ];
}