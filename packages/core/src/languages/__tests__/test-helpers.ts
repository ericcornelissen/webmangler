import type { MangleExpression } from "../../types";

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
