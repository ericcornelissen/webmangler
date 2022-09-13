import type {
  MangleExpression,
  QuerySelectorOptions,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

type QuerySelectorConfig = QuerySelectorOptions;

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
function fallback(
  options: QuerySelectorOptions,
): Iterable<MangleExpression> {
  const config: QuerySelectorConfig = {
    ...options,
  };

  return [
    ...newCssSelectorExpression(config),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match CSS selectors in CSS. This
 * will match:
 * - Attribute selectors (e.g. `foobar` in `[foobar] { }`).
 * - Class selectors (e.g. `foobar` in `.foobar { }`).
 * - Element selectors (e.g. `div` in `div { }`).
 * - ID selectors (e.g. `foobar` in `#foobar { }`).
 *
 * If no `kind` is specified, this will fall back to the behaviour of v0.1.29 of
 * the plugin.
 *
 * @param options The {@link QuerySelectorOptions}.
 * @returns A set of {@link MangleExpression}s.
 */
function querySelectorExpressionFactory(
  options: QuerySelectorOptions,
): Iterable<MangleExpression> {
  if (options.kind === undefined) {
    return fallback(options);
  }

  return [
    // TODO: Add implementation
  ];
}

export default querySelectorExpressionFactory;
