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
    {
      name: "multi-value",
      cases: [
        {
          input: "div { margin: 0 42px; }",
          pattern: "[0-9]+",
          expected: ["42"],
          options: {
            suffix: "px",
          },
        },
        {
          input: "div { padding: 0 3px 0 14px; }",
          pattern: "[0-9]+",
          expected: ["3", "14"],
          options: {
            suffix: "px",
          },
        },
      ],
    },
    {
      name: "with !important",
      cases: [
        {
          input: "div { margin: 42px !important; }",
          pattern: "[0-9]+",
          expected: ["42"],
          options: {
            suffix: "px",
          },
        },
        {
          input: "div { padding: 0 3px 0 14px!important; }",
          pattern: "[0-9]+",
          expected: ["3", "14"],
          options: {
            suffix: "px",
          },
        },
      ],
    },
    {
      name: "with comments",
      cases: [
        {
          input: "div { color: red /* set the color */; }",
          pattern: "[a-z]+",
          expected: ["red"],
          options: { },
        },
        {
          input: "div { color: /* set the color */ red; }",
          pattern: "[a-z]+",
          expected: ["red"],
          options: { },
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
