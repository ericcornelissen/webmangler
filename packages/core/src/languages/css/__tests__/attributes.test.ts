import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import attributeExpressionFactory from "../attributes";

type TestCase = {
  s: string;
  pattern: string;
  expected: string[];
};

suite("CSS - Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "attribute selector",
      cases: [
        {
          s: "[data-foo] { }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          s: "div[data-foo] { }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          s: "[data-foo][data-bar] { }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-bar"],
        },
      ],
    },
    {
      name: "attribute usage",
      cases: [
        {
          s: "div { content: attr(data-foo); }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          s: "div { content: attr(data-foo, \"bar\"); }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
        },
        {
          s: "div { content: attr(data-foo px); }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
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
        } = testCase;

        const expressions = attributeExpressionFactory();

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
