import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import cssDeclarationValueExpressionFactory from "../css-values";

type TestCase = {
  s: string;
  pattern: string;
  expected: string[];
  prefix?: string;
  suffix?: string;
};

suite("HTML - CSS Value Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          s: "<div style=\"color: red\"></div>",
          pattern: "[a-z]+",
          expected: ["red"],
        },
        {
          s: "<div style=\"color: red; font: serif\"></div>",
          pattern: "[a-z]+",
          expected: ["red", "serif"],
        },
        {
          s: "<div style=\"color: red; font-size: 12px\"></div>",
          pattern: "[a-z]+",
          expected: ["px"],
          prefix: "[0-9]+",
        },
        {
          s: "<div style=\"padding-left: 3px; margin-left: 14px\"></div>",
          pattern: "[0-9]+",
          expected: ["3", "14"],
          suffix: "px",
        },
      ],
    },
  ];

  for (const { name, cases } of scenarios) {
    test(name, function() {
      for (const testCase of cases) {
        const {
          s,
          pattern,
          expected,
          prefix,
          suffix,
        } = testCase;

        const expressions = cssDeclarationValueExpressionFactory({
          prefix: prefix,
          suffix: suffix,
        });

        const someExpressionMatches = expressions.some((expression) => {
          const _matched = expression.exec(s, pattern);
          const matched = Array.from(_matched);
          return matched.every((s) => expected.includes(s))
            && expected.every((s) => matched.includes(s));
        });

        expect(someExpressionMatches).to.equal(true, `in "${s}"`);
      }
    });
  }
});
