/**
 * A standard TestCase type for {@link TestScenario}s of {@link
 * ExpressionFactory}s.
 */
type TestCase<T> = {
  /**
   * The input string to match against.
   */
  input: string;

  /**
   * The pattern to use for matching.
   */
  pattern: string;

  /**
   * The expected matches.
   */
  expected: string[];

  /**
   * The factory options.
   */
  options: T;
};

export {
  TestCase,
};
