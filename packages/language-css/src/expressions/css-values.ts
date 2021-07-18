import type { MangleExpression } from "@webmangler/types";
import type { CssDeclarationValueOptions } from "../options";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

const GROUP_MAIN = "main";

/**
 * Get a {@link MangleExpression} to match the value of CSS declarations in CSS,
 * e.g. `serif` in `div { font: serif; }`.
 *
 * @param valuePrefix The prefix required on values.
 * @param valueSuffix The suffix required on values.
 * @returns The {@link MangleExpression}s to match declaration values in CSS.
 */
function newCssDeclarationValueExpression(
  valuePrefix: string,
  valueSuffix: string,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression(
      `
        (?:
          (?:${patterns.anyString}|${patterns.comment})
          |
          (?<=
            \\{
            [^\\}]+
            :
            [^;]*
            (?<=
              :|\\s|\\(|,|
              ${patterns.commentClose}|
              ${patterns.arithmeticOperators}
            )
            ${valuePrefix}
          )
          (?<${GROUP_MAIN}>%s)
          (?=
            ${valueSuffix}
            (?:
              \\s|,|\\)|\\!|\\;|\\}|
              ${patterns.commentClose}|
              ${patterns.arithmeticOperators}
            )
          )
        )
      `,
      GROUP_MAIN,
    ),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match the values of CSS
 * declarations in CSS. This will match:
 * - Values as part of a CSS declaration (e.g. `bar` in `div { foo: bar }`).
 *
 * @param options The {@link CssDeclarationValueOptions}.
 * @returns A set of {@link MangleExpression}s.
 * @since v0.1.14
 * @version v0.1.23
 */
export default function cssDeclarationValueExpressionFactory(
  options: CssDeclarationValueOptions,
): Iterable<MangleExpression> {
  const valuePrefix = options.prefix ? options.prefix : "";
  const valueSuffix = options.suffix ? options.suffix : "";

  return [
    ...newCssDeclarationValueExpression(valuePrefix, valueSuffix),
  ];
}
