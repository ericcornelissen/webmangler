import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import multiValueAttributeExpressionFactory from "../multi-value-attributes";

type TestCase = {
  s: string;
  pattern: string;
  expected: string[];
  attributeNames: string[];
};

suite("HTML - Multi Value Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          s: "<div class=\"foobar\"></div>",
          attributeNames: ["class"],
          pattern: "[a-z]+",
          expected: ["foobar"],
        },
        {
          s: "<div class=\"foo bar\"></div>",
          attributeNames: ["class"],
          pattern: "[a-z]+",
          expected: ["foo", "bar"],
        },
        {
          s: "<div class=\"praise the sun\"></div>",
          attributeNames: ["class"],
          pattern: "[a-z]{3}",
          expected: ["the", "sun"],
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
          attributeNames,
        } = testCase;

        const expressions = multiValueAttributeExpressionFactory({
          attributeNames: attributeNames,
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
