/**
 * A {@link TestScenario} is a collection of `TestCase`s grouped together under
 * a name.
 *
 * @example
 * type TestCase = { input: string, expected: string };
 * const scenarios: TestScenario<TestCase>[] = [...];
 * for (const { name, cases } of scenarios) {
 *   test(name, function() {
 *     for (const testCase of cases) {
 *       // Testing logic ...
 *     }
 *   });
 * }
 * @since v0.1.0
 */
export interface TestScenario<TestCase> {
  /**
   * The name of the test scenario. This should be used as (part of) a test
   * case.
   *
   * @since v0.1.0
   */
  readonly name: string;

  /**
   * The list of test cases.
   *
   * @since v0.1.0
   */
  readonly cases: TestCase[];
}
