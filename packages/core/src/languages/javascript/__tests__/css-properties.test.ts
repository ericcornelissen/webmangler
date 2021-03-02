import type { TestScenario } from "@webmangler/testing";
import type { CssDeclarationPropertyOptions } from "../../options";

import { expect } from "chai";

import { matchesAsExpected } from "../../__tests__/test-helpers";

import cssDeclarationPropertyExpressionFactory from "../css-properties";

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
  options: CssDeclarationPropertyOptions;
};

suite("JavaScript - CSS Property Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "$element.style.getPropertyValue(\"color\");",
          pattern: "[a-z]+",
          expected: ["color"],
          options: { },
        },
        {
          input: "$element.style.getPropertyValue(\"font-size\");",
          pattern: "[a-z]+",
          expected: ["size"],
          options: {
            prefix: "font-",
          },
        },
        {
          input: "$element.style.getPropertyValue(\"margin-left\");",
          pattern: "[a-z]+",
          expected: ["margin"],
          options: {
            suffix: "-left",
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

        const expressions = cssDeclarationPropertyExpressionFactory(options);
        const result = matchesAsExpected(expressions, input, pattern, expected);
        expect(result).to.equal(true, `in "${input}"`);
      }
    });
  }
});
