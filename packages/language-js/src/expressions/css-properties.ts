import type {
  CssDeclarationPropertyOptions,
  MangleExpression,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

type CssDeclarationPropertyConfig = Required<CssDeclarationPropertyOptions>;

const GROUP_QUOTE = "q";

/**
 * Get a {@link MangleExpression} to match property names as standalone strings
 * in JavaScript, e.g. `foobar` in `$element.style.getPropertyValue("foobar");`.
 *
 * @param config The {@link CssDeclarationPropertyConfig}.
 * @returns The {@link MangleExpression}s to match standalone properties in JS.
 */
function newPropertyAsStandaloneStringExpressions(
  config: CssDeclarationPropertyConfig,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            (?<${GROUP_QUOTE}>${patterns.quotes})
            \\s*
            ${config.prefix}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${config.suffix}
            \\s*
            \\k<${GROUP_QUOTE}>
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match the properties of CSS
 * declarations in JavaScript. This will match:
 * - Standalone strings (e.g. `foobar` in `getPropertyValue("foobar");`).
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
    ...newPropertyAsStandaloneStringExpressions(config),
  ];
}

export default cssDeclarationPropertyExpressionFactory;
