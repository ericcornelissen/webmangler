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
 * Get {@link MangleExpression}s to match query selectors for attributes in CSS,
 * e.g. `data-foobar` in `[data-foobar] { }`.
 *
 * @returns The {@link MangleExpression}s.
 */
function newAttributeSelectorExpression(): Iterable<MangleExpression> {
  return newCssSelectorExpression({
    kind: "attribute",
    prefix: /\[\s*/.source,
    suffix: /\s*(?:]|${attributeOperators})/.source
      .replace("${attributeOperators}", patterns.attributeOperators),
  });
}

/**
 * Get {@link MangleExpression}s to match query selectors for classes in CSS,
 * e.g. `foobar` in `.foobar { }`.
 *
 * @returns The {@link MangleExpression}s.
 */
function newClassSelectorExpression(): Iterable<MangleExpression> {
  return newCssSelectorExpression({
    kind: "class",
    prefix: /\./.source,
  });
}

/**
 * Get {@link MangleExpression}s to match query selectors for elements in CSS,
 * e.g. `div` in `div { }`.
 *
 * @returns The {@link MangleExpression}s.
 */
function newElementSelectorExpression(): Iterable<MangleExpression> {
  return newCssSelectorExpression({
    kind: "element",
  });
}


/**
 * Get {@link MangleExpression}s to match query selectors for IDs in CSS, e.g.
 * `foobar` in `#foobar { }`.
 *
 * @returns The {@link MangleExpression}s.
 */
function newIdSelectorExpression(): Iterable<MangleExpression> {
  return newCssSelectorExpression({
    kind: "id",
    prefix: /#/.source,
  });
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
    ...(options.kind === "attribute" ? newAttributeSelectorExpression() : []),
    ...(options.kind === "class" ? newClassSelectorExpression() : []),
    ...(options.kind === "element" ? newElementSelectorExpression() : []),
    ...(options.kind === "id" ? newIdSelectorExpression() : []),
  ];
}

export default querySelectorExpressionFactory;
