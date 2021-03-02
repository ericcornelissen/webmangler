import type { TestScenario } from "@webmangler/testing";
import type { QuerySelectorOptions } from "../../options";

import { expect } from "chai";

import { matchesAsExpected } from "../../__tests__/test-helpers";

import querySelectorExpressionFactory from "../query-selectors";

type TestCase = {
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
  options: QuerySelectorOptions;
};

suite("CSS - Query Selector Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          input: ".foobar { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: ".foobar { }",
          pattern: "[a-z]+",
          expected: [],
          options: {
            prefix: "#",
          },
        },
        {
          input: "#foobar { }",
          pattern: "[a-z]+",
          expected: [],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: "#foobar { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "#",
          },
        },
      ],
    },
  ];

  for (const { name, cases } of scenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const {
          input,
          pattern,
          expected,
          options,
        } = testCase;

        const expressions = querySelectorExpressionFactory(options);
        const result = matchesAsExpected(expressions, input, pattern, expected);
        expect(result).to.equal(true, `in "${input}"`);
      }
    });
  }
});
