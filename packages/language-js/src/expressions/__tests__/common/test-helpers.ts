import type { MangleExpression } from "@webmangler/types";

/**
 * Execute several `expression` on an `input` for a given `pattern` and return
 * the matches found.
 *
 * @param expressions The {@link MangleExpression}s.
 * @param input The text to match against.
 * @param pattern The pattern to match with.
 * @returns The matches found.
 */
function getAllMatches(
  expressions: Iterable<MangleExpression>,
  input: string,
  pattern: string,
): string[] {
  return Array.from(expressions)
    .reduce((matches: string[], expression: MangleExpression) => {
      for (const match of expression.findAll(input, pattern)) {
        matches.push(match);
      }

      return matches;
    }, []);
}

export {
  getAllMatches,
};
