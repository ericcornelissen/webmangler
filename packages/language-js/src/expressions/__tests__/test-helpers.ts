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
export function getAllMatches(
  expressions: Iterable<MangleExpression>,
  input: string,
  pattern: string,
): string[] {
  const matches: string[] = [];
  Array.from(expressions).some((expression) => {
    for (const match of expression.findAll(input, pattern)) {
      matches.push(match);
    }
  });

  return matches;
}
