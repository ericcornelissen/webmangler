import type {
  MangleExpression,
  QuerySelectorOptions,
} from "@webmangler/types";

import {
  NestedGroupMangleExpression,
  SingleGroupMangleExpression,
} from "@webmangler/language-utils";
import { patterns, QUOTES_ARRAY } from "./common";

type QuerySelectorConfig = QuerySelectorOptions;

const GROUP_QUOTE = "quote";

/**
 * Get {@link MangleExpression}s to match query selectors in JavaScript, e.g.
 * `foobar` in `document.querySelectorAll(".foobar");`.
 *
 * @param config The {@link QuerySelectorConfig}.
 * @returns The {@link MangleExpression}s to match query selectors in JS.
 */
function newQuerySelectorExpressions(
  config: QuerySelectorConfig,
): Iterable<MangleExpression> {
  return QUOTES_ARRAY.map((quote) => {
    const captureGroup = NestedGroupMangleExpression.CAPTURE_GROUP({
      before: `${quote}(?:\\\\${quote}|[^${quote}])*`,
      after: `(?:\\\\${quote}|[^${quote}])*${quote}`,
    });

    return new NestedGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment})
          |
          ${captureGroup}
          |
          (?:
            ${quote}
            (?:\\\\${quote}|[^${quote}])*
            ${quote}
          )
        )
      `,
      subPatternTemplate: `
        (?<=
          ${config.prefix || `(?:${quote}|${patterns.allowedBeforeSelector})`}
        )
        ${NestedGroupMangleExpression.SUB_CAPTURE_GROUP}
        (?=
          ${config.suffix || `(?:${quote}|${patterns.allowedAfterSelector})`}
        )
      `,
    });
  });
}

/**
 * Get a {@link MangleExpression} to match selectors as standalone strings in
 * JavaScript, e.g. `foobar` in `document.getElementById("foobar");`.
 *
 * @returns The {@link MangleExpression}s to match standalone selectors in JS.
 */
function newSelectorAsStandaloneStringExpressions():
    Iterable<MangleExpression> {
  return [
    new SingleGroupMangleExpression({
      patternTemplate: `
        (?:
          (?:${patterns.comment})
          |
          (?<=
            (?<${GROUP_QUOTE}>${patterns.quotes})
            \\s*
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            \\s*
            \\k<${GROUP_QUOTE}>
          )
        )
      `,
    }),
  ];
}

/**
 * Get the set of {@link MangleExpression}s to match query selectors in
 * JavaScript. This will match:
 * - Query selectors (e.g. `foobar` in `querySelector(".foobar");`).
 * - Standalone strings (e.g. `foobar` in `getElementById("foobar");`).
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

  const result = [
    ...newQuerySelectorExpressions(config),
  ];

  if (options.suffix || options.prefix) {
    result.push(...newSelectorAsStandaloneStringExpressions());
  }

  return result;
}

/**
 * Get the set of {@link MangleExpression}s to match query selectors in
 * JavaScript. This will match:
 * - Attribute selectors (e.g. `foobar` in `querySelector("[foobar]")`).
 * - Class selectors (e.g. `foobar` in `querySelector(".foobar")`).
 * - Element selectors (e.g. `div` in `querySelector("div")`).
 * - ID selectors (e.g. `foobar` in `querySelector("#foobar")`).
 * - Standalone strings (e.g. `foobar` in `getElementById("foobar");`).
 *
 * If no `kind` is specified, this will fall back to the behaviour of v0.1.28 of
 * the plugin.
 *
 * @param options The {@link QuerySelectorOptions}.
 * @returns A set of {@link MangleExpression}s.
 */
function querySelectorExpressionFactory(
  options: QuerySelectorOptions,
): Iterable<MangleExpression> {
  switch (options.kind) {
  case undefined:
    return fallback(options);
  }

  return [
    // TODO: Add implementation
  ];
}

export default querySelectorExpressionFactory;
