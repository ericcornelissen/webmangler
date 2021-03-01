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

suite("JavaScript - CSS Property Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          s: "$element.style.getPropertyValue(\"color\");",
          pattern: "[a-z]+",
          expected: ["color"],
        },
        {
          s: "$element.style.getPropertyValue(\"font-size\");",
          pattern: "[a-z]+",
          expected: ["size"],
          prefix: "font-",
        },
        {
          s: "$element.style.getPropertyValue(\"margin-left\");",
          pattern: "[a-z]+",
          expected: ["margin"],
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
