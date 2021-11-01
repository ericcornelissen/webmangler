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
interface TestScenario<TestCase> {
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

/**
 * A {@link TestValues} instance is a collection of values that represent the
 * components of a document.
 *
 * @example
 * type HtmlKeyName = "tagname" | "attributes" | "content";
 * type HtmlValues = TestValues<HtmlKeyName>;
 * const htmlValues: HtmlValues = {
 *   tagname: "div",
 *   attributes: "id=\"foobar\" class=\"foo bar\"",
 *   content: "Lorem ipsum dolor",
 * };
 * @since v0.1.5
 */
type TestValues<KeyName extends string> = {
  [key in KeyName]?: string;
}

/**
 * A {@link TestValuesPresets} instance is a collection of collections of sample
 * values that can be used for {@link TestValuesSets}.
 *
 * Note, the difference with {@link TestValuesSets} is that all fields are
 * required as it is intended to provide a sample of values for every possible
 * field of {@link TestValuesSets} instances.
 *
 * @example
 * type HtmlKeyName = "tagname" | "attributes" | "content";
 * type HtmlValuesPresets = TestValuesPresets<HtmlKeyName>;
 * const htmlValuesPresets: HtmlValuesPresets = {
 *   tagname: ["div", "span"],
 *   attributes: ["id=\"foobar\"", "class=\"foo bar\""],
 *   content: ["Hello world!", "Goodbye cruel world!"],
 * };
 * @since v0.1.5
 */
type TestValuesPresets<KeyName extends string> = {
  [key in KeyName]: Iterable<string | undefined>;
}

/**
 * A {@link TestValuesSets} instance is a collection of collections of test
 * values that can be used to build a document.
 *
 * @example
 * type HtmlKeyName = "tagname" | "attributes" | "content";
 * type HtmlValuesSets = TestValuesSets<HtmlKeyName>;
 * const htmlValuesSets: HtmlValuesSets = {
 *   tagname: ["div", "span"],
 *   attributes: ["id=\"foobar\"", "class=\"foo bar\""],
 *   content: ["Hello world!", "Goodbye cruel world!"],
 * };
 * @since v0.1.5
 */
type TestValuesSets<KeyName extends string> = {
  [key in KeyName]?: Iterable<string | undefined>;
}

export {
  TestScenario,
  TestValues,
  TestValuesPresets,
  TestValuesSets,
};
