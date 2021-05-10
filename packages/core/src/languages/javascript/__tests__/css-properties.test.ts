import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { CssDeclarationPropertyOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import cssDeclarationPropertyExpressionFactory from "../css-properties";

suite("JavaScript - CSS Property Expression Factory", function() {
  const scenarios: TestScenario<TestCase<CssDeclarationPropertyOptions>>[] = [
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
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected);
      }
    });
  }
});
