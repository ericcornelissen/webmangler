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

suite("CSS - Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "attribute selector",
      cases: [
        {
          input: "[data-foo] { }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          input: "div[data-foo] { }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          input: "[data-foo][data-bar] { }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-bar"],
        },
      ],
    },
    {
      name: "attribute usage",
      cases: [
        {
          input: "div { content: attr(data-foo); }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          input: "div { content: attr(data-foo, \"bar\"); }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          input: "div { content: attr(data-foo px); }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
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
