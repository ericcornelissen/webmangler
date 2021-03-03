import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { CssDeclarationValueOptions } from "../../options";

import { expect } from "chai";

import { matchesAsExpected } from "../../__tests__/test-helpers";

import cssDeclarationValueExpressionFactory from "../css-values";

suite("HTML - CSS Value Expression Factory", function() {
  const scenarios: TestScenario<TestCase<CssDeclarationValueOptions>>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "<div style=\"color: red\"></div>",
          pattern: "[a-z]+",
          expected: ["red"],
          options: { },
        },
        {
          input: "<div style=\"color: red; font: serif\"></div>",
          pattern: "[a-z]+",
          expected: ["red", "serif"],
          options: { },
        },
        {
          input: "<div style=\"color: red; font-size: 12px\"></div>",
          pattern: "[a-z]+",
          expected: ["px"],
          options: {
            prefix: "[0-9]+",
          },
        },
        {
          input: "<div style=\"padding-left: 3px; margin-left: 14px\"></div>",
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
