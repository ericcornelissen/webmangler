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

suite("JavaScript - Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "document.querySelectorAll(\"[data-foo]\");",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          input: "$element.getAttribute(\"data-bar\");",
          pattern: "[a-z\\-]+",
          expected: ["data-bar"],
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
