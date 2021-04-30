import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { CssDeclarationPropertyOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import cssDeclarationPropertyExpressionFactory from "../css-properties";

suite("HTML - CSS Property Expression Factory", function() {
  const scenarios: TestScenario<TestCase<CssDeclarationPropertyOptions>>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "<div style=\"color: red\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["color"],
          options: { },
        },
        {
          input: "<div style=\"color: red; font: serif\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["color", "font"],
          options: { },
        },
        {
          input: "<div style=\"color: red; font-size: 12px\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["size"],
          options: {
            prefix: "font-",
          },
        },
        {
          input: "<div style=\"padding-left: 3px; margin-left: 14px\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["padding", "margin"],
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
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected);
      }
    });
  }
});
