import type { MangleExpression } from "../../types";

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
    for (const match of expression.exec(input, pattern)) {
      matches.push(match);
    }
  });

  return matches;
}

/**
 * Check whether any of the `expression`s matches the `expected` values on the
 * given `input` with the given `pattern`.
 *
 * @param expressions The {@link MangleExpression}s to test with.
 * @param input The input string to test on.
 * @param pattern The pattern to test with.
 * @param expected The expected matches.
 * @returns `true` if any of the expressions matches as expected.
 */
export function matchesAsExpected(
  expressions: Iterable<MangleExpression>,
  input: string,
  pattern: string,
  expected: string[],
): boolean {
  return Array.from(expressions).some((expression) => {
    let i = 0;
    for (const match of expression.exec(input, pattern)) {
      if (match !== expected[i++]) {
        return false;
      }
    }

    return i === expected.length;
  });
}
