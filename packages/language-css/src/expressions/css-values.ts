import type {
  CssDeclarationValueOptions,
  MangleExpression,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

type CssDeclarationValueConfig = Required<CssDeclarationValueOptions>;

/**
 * Get a {@link MangleExpression} to match the value of CSS declarations in CSS,
 * e.g. `serif` in `div { font: serif; }`.
 *
 * @param config The {@link CssDeclarationValueConfig}.
 * @returns The {@link MangleExpression}s to match declaration values in CSS.
 */
function newCssDeclarationValueExpression(
  config: CssDeclarationValueConfig,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.anyString}|${patterns.comment})
          |
          (?<=
            \\{
            (?:${patterns.comment}|[^\\}])+
            :
            (?:${patterns.comment}|[^;])*
            (?<=
              :|\\s|\\(|,|
              ${patterns.comment}|
              ${patterns.arithmeticOperators}
            )
            ${config.prefix}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${config.suffix}
            (?:
              \\s|,|\\)|\\!|\\;|\\}|
              ${patterns.comment}|
              ${patterns.arithmeticOperators}
            )
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match the values of CSS
 * declarations in CSS. This will match:
 * - Values as part of a CSS declaration (e.g. `bar` in `div { foo: bar }`).
 *
 * @param options The {@link CssDeclarationValueOptions}.
 * @returns A set of {@link MangleExpression}s.
 */
function cssDeclarationValueExpressionFactory(
  options: CssDeclarationValueOptions,
): Iterable<MangleExpression> {
  const config: CssDeclarationValueConfig = {
    kind: options.kind,
    prefix: options.prefix ? options.prefix : "",
    suffix: options.suffix ? options.suffix : "",
  };

  return [
    ...newCssDeclarationValueExpression(config),
  ];
}

export default cssDeclarationValueExpressionFactory;
