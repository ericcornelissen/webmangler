import type {
  CssDeclarationPropertyOptions,
  MangleExpression,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

type CssDeclarationPropertyConfig = Required<CssDeclarationPropertyOptions>;

/**
 * Get a {@link MangleExpression} to match the property of CSS declarations in
 * CSS, e.g. `font` in `div { font: serif; }`.
 *
 * @param config The {@link CssDeclarationPropertyConfig}.
 * @returns The {@link MangleExpression}s to match properties in CSS.
 */
function newCssDeclarationPropertyExpression(
  config: CssDeclarationPropertyConfig,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.anyString}|${patterns.comment})
          |
          (?<=
            (?:
              \\;|\\{|
              ${patterns.commentClose}
            )\\s*
            ${config.prefix}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${config.suffix}
            \\s*
            (?:${patterns.comment})?
            \\s*:
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match the properties of CSS
 * declarations in CSS. This will match:
 * - Properties as part of a CSS declaration (e.g. `foo` in `div { foo: bar }`).
 *
 * @param options The {@link CssDeclarationPropertyOptions}.
 * @returns A set of {@link MangleExpression}s.
 */
function cssDeclarationPropertyExpressionFactory(
  options: CssDeclarationPropertyOptions,
): Iterable<MangleExpression> {
  const config: CssDeclarationPropertyConfig = {
    prefix: options.prefix ? options.prefix : "",
    suffix: options.suffix ? options.suffix : "",
  };

  return [
    ...newCssDeclarationPropertyExpression(config),
  ];
}

export default cssDeclarationPropertyExpressionFactory;
