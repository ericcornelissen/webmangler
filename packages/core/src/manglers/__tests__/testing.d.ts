/**
 * A {@link TestCase} is a test case specifying some input and the expected
 * result.
 */
export interface TestCase {
  input: string;
  pattern?: string;
  reserved?: string[];
  prefix?: string;
  expected: string;

  description?: string;
}

/**
 * A {@link TestScenario} is a collection of {@link TestCase}s grouped together
 * with a name.
 */
export interface TestScenario {
  name: string;
  cases: TestCase[];
}
