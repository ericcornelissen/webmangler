import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import cssDeclarationPropertyExpressionFactory from "../css-properties";

type TestCase = {
  s: string;
  pattern: string;
  expected: string[];
  prefix?: string;
  suffix?: string;
};

suite("CSS - CSS Property Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          s: "div { color: red; }",
          pattern: "[a-z]+",
          expected: ["color"],
        },
        {
          s: "div { color: red; font: serif; }",
          pattern: "[a-z]+",
          expected: ["color", "font"],
        },
        {
          s: "div { color: red; font-size: 12px; }",
          pattern: "[a-z]+",
          expected: ["size"],
          prefix: "font-",
        },
        {
          s: "div { padding-left: 3px; margin-left: 14px; }",
          pattern: "[a-z]+",
          expected: ["padding", "margin"],
          suffix: "-left",
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

        const expressions = cssDeclarationPropertyExpressionFactory({
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
