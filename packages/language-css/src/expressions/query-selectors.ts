import type {
  MangleExpression,
  QuerySelectorOptions,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

type QuerySelectorConfig
  = Required<Pick<QuerySelectorOptions, "caseSensitive">>
  & Omit<QuerySelectorOptions, "caseSensitive">;

/**
 * Get a {@link MangleExpression} to match query selectors in CSS, e.g. `foobar`
 * in `.foobar { }`.
 *
 * @param config The {@link QuerySelectorConfig}.
 * @returns The {@link MangleExpression}s to match query selectors in CSS.
 */
function newCssSelectorExpression(
  config: QuerySelectorConfig,
): Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.anyString}|${patterns.comment}|${patterns.ruleset})
          |
          (?<=
            ${config.prefix ? config.prefix : `
              (?:
                ^|\\}|
                ${patterns.allowedBeforeSelector}|
                ${patterns.commentClose}
              )
            `}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${config.suffix ? config.suffix : `
              (?:
                $|\\{|
                ${patterns.allowedAfterSelector}|
                ${patterns.commentOpen}
              )
            `}
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match CSS selectors in CSS. This
 * will match:
 * - CSS selectors (e.g. `foobar` in `.foobar { }`).
 *
 * @param options The {@link QuerySelectorOptions}.
 * @returns A set of {@link MangleExpression}s.
 */
function querySelectorExpressionFactory(
  options: QuerySelectorOptions,
): Iterable<MangleExpression> {
  const config: QuerySelectorConfig = {
    ...options,
    caseSensitive: options.caseSensitive === undefined
      ? true
      : options.caseSensitive,
  };

  return [
    ...newCssSelectorExpression(config),
  ];
}

export default querySelectorExpressionFactory;
