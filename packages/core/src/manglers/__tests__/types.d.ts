/**
 * A {@link SelectorBeforeAndAfter} is an object that can be used to specify a
 * reusable expected mapping from `before` (unmangled) to `after` (mangled).
 */
export interface SelectorBeforeAndAfter {
  readonly before: string;
  readonly after: string;
}
/**
 * A {@link SelectorPairBeforeAndAfter} is an object that can be used to specify
 * a reusable pair of expected mappings from `before` (unmangled) to `after`
 * (mangled).
 */
export interface SelectorPairBeforeAndAfter {
  readonly beforeA: string;
  readonly beforeB: string;
  readonly afterA: string;
  readonly afterB: string;
}

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
