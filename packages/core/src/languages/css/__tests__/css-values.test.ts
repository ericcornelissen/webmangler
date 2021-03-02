import type { TestScenario } from "@webmangler/testing";
import type { CssDeclarationValueOptions } from "../../options";

import { expect } from "chai";

import { matchesAsExpected } from "../../__tests__/test-helpers";

import cssDeclarationValueExpressionFactory from "../css-values";

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
  options: CssDeclarationValueOptions;
};

suite("CSS - CSS Value Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "div { color: red; }",
          pattern: "[a-z]+",
          expected: ["red"],
          options: { },
        },
        {
          input: "div { color: red; font: serif; }",
          pattern: "[a-z]+",
          expected: ["red", "serif"],
          options: { },
        },
        {
          input: "div { color: red; font-size: 12px; }",
          pattern: "[a-z]+",
          expected: ["px"],
          options: {
            prefix: "[0-9]+",
          },
        },
        {
          input: "div { padding-left: 3px; margin-left: 14px; }",
          pattern: "[0-9]+",
          expected: ["3", "14"],
          options: {
            suffix: "px",
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

        const expressions = cssDeclarationValueExpressionFactory(options);
        const result = matchesAsExpected(expressions, input, pattern, expected);
        expect(result).to.equal(true, `in "${input}"`);
      }
    });
  }
});
