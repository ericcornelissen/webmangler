import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { CssDeclarationValueOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import cssDeclarationValueExpressionFactory from "../css-values";

suite("CSS - CSS Value Expression Factory", function() {
  const scenarios: TestScenario<TestCase<CssDeclarationValueOptions>>[] = [
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
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected);
      }
    });
  }
});
