/**
 * A {@link TestCase} is a test case specifying some input and the expected
 * result for manglers. Additionally, it can be used to specify a pattern,
 * prefix, or reserved values for mangling.
 */
export interface TestCase {
  description?: string;
  expected: string;
  input: string;
  pattern?: string;
  prefix?: string;
  reserved?: string[];
}
