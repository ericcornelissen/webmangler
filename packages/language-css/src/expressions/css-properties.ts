import type { MangleExpression } from "@webmangler/types";
import type { CssDeclarationPropertyOptions } from "../options";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match the property of CSS declarations in
 * CSS, e.g. `font` in `div { font: serif; }`.
 *
 * @param propertyPrefix The prefix required on properties.
 * @param propertySuffix The suffix required on properties.
 * @returns The {@link MangleExpression}s to match properties in CSS.
 */
function newCssDeclarationPropertyExpression(
  propertyPrefix: string,
  propertySuffix: string,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression(
      `
        (?:
          (?:${patterns.anyString}|${patterns.comment})
          |
          (?<=
            (?:
              \\;|\\{|
              ${patterns.commentClose}
            )\\s*
            ${propertyPrefix}
          )
          (?<${GROUP_MAIN}>%s)
          (?=
            ${propertySuffix}
            \\s*
            (?:${patterns.comment})?
            \\s*:
          )
        )
      `,
      GROUP_MAIN,
    ),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match the properties of CSS
 * declarations in CSS. This will match:
 * - Properties as part of a CSS declaration (e.g. `foo` in `div { foo: bar }`).
 *
 * @param options The {@link CssDeclarationPropertyOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.21
 */
export default function cssDeclarationPropertyExpressionFactory(
  options: CssDeclarationPropertyOptions,
): Iterable<MangleExpression> {
  const propertyPrefix = options.prefix ? options.prefix : "";
  const propertySuffix = options.suffix ? options.suffix : "";

  return [
    ...newCssDeclarationPropertyExpression(propertyPrefix, propertySuffix),
  ];
}
