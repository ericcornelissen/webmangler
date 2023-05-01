import type {
  CssDeclarationValueOptions,
  MangleExpression,
} from "@webmangler/types";

import { SingleGroupMangleExpression } from "@webmangler/language-utils";
import { patterns } from "./common";

type CssDeclarationValueConfig = CssDeclarationValueOptions;

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
            ${config.prefix || ""}
          )
          ${SingleGroupMangleExpression.CAPTURE_GROUP}
          (?=
            ${config.suffix || ""}
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
function fallback(
  options: CssDeclarationValueOptions,
): Iterable<MangleExpression> {
  const config: CssDeclarationValueConfig = {
    kind: options.kind,
    prefix: options.prefix,
    suffix: options.suffix,
  };

  return [
    ...newCssDeclarationValueExpression(config),
  ];
}

/**
 * Get {@link MangleExpression}s to match function values in CSS, e.g. `bar` in
 * `div { foo: attr(bar); }`.
 *
 * @returns The {@link MangleExpression}s.
 */
function newFunctionExpressions(): Iterable<MangleExpression> {
  return [
    ...newCssDeclarationValueExpression({
      kind: "function",
      prefix: /(?:ATTR|ATTr|ATtR|ATtr|AtTR|AtTr|AttR|Attr|aTTR|aTTr|aTtR|aTtr|atTR|atTr|attR|attr)\s*\(\s*/.source,
      suffix: /\s*(?:,[^)]+)?\)/.source,
    }),
    ...newCssDeclarationValueExpression({
      kind: "function",
      prefix: /(?:VAR|VAr|VaR|Var|vAR|vAr|vaR|var)\s*\(\s*/.source,
      suffix: /\s*(?:,[^)]+)?\)/.source,
    }),
  ];
}

/**
 * Get {@link MangleExpression}s to match values in CSS, e.g. `bar` in
 * `div { foo: bar; }`.
 *
 * @returns The {@link MangleExpression}s.
 */
function newValueExpressions(): Iterable<MangleExpression> {
  return [
    ...newCssDeclarationValueExpression({
      kind: "value",
    }),
  ];
}

/**
 * Get {@link MangleExpression}s to match variable names in CSS, e.g. `bar` in
 * `div { foo: --bar; }`.
 *
 * @returns The {@link MangleExpression}s.
 */
function newVariableExpressions(): Iterable<MangleExpression> {
  return [
    ...newCssDeclarationValueExpression({
      kind: "variable",
      prefix: /--/.source,
    }),
  ];
}

/**
 * Get a collection of {@link MangleExpression}s to match the values of CSS
 * declarations in CSS. This will match:
 * - Function names (e.g. `bar` in `div { foo: attr(bar); }`).
 * - Values  (e.g. `bar` in `div { foo: bar; }`).
 * - Variables names (e.g. `bar` in `div { foo: --bar; }`).
 *
 * @param options The {@link CssDeclarationValueOptions}.
 * @returns A set of {@link MangleExpression}s.
 */
function cssDeclarationValueExpressionFactory(
  options: CssDeclarationValueOptions,
): Iterable<MangleExpression> {
  if (options.kind === undefined) {
    return fallback(options);
  }

  switch (options.kind) {
  case "function": return newFunctionExpressions();
  case "value": return newValueExpressions();
  case "variable": return newVariableExpressions();
  }
}

export default cssDeclarationValueExpressionFactory;
