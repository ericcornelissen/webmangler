import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import { matchesAsExpected } from "../../__tests__/test-helpers";

import attributeExpressionFactory from "../attributes";

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
};

suite("HTML - Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "<div data-foo></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          input: "<div data-foo=\"bar\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          input: "<div data-foo=\"bar\" data-bar=\"foo\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-bar"],
        },
        {
          input: "<div data-foo='bar'></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          input: "<div data-foo='bar' data-bar='foo'></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-bar"],
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
        } = testCase;

        const expressions = attributeExpressionFactory();
        const result = matchesAsExpected(expressions, input, pattern, expected);
        expect(result).to.equal(true, `in "${input}"`);
      }
    });
  }
});
