import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import singleValueAttributeExpressionFactory from "../single-value-attributes";

type TestCase = {
  s: string;
  pattern: string;
  expected: string[];
  attributeNames: string[];
  valuePrefix?: string;
  valueSuffix?: string;
};

suite("CSS - Single Value Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          s: "[data-foo=\"bar\"] { }",
          pattern: "[a-z]+",
          expected: ["bar"],
          attributeNames: ["data-foo"],
        },
        {
          s: "[class=\"foobar\"] { }",
          pattern: "[a-z]+",
          expected: ["bar"],
          attributeNames: ["class"],
          valuePrefix: "foo",
        },
        {
          s: "[class=\"foobar\"] { }",
          pattern: "[a-z]+",
          expected: ["foo"],
          attributeNames: ["class"],
          valueSuffix: "bar",
        },
        {
          s: "[class=\"praise the sun\"] { }",
          pattern: "[a-z]+",
          expected: ["the"],
          attributeNames: ["class"],
          valuePrefix: "praise\\s*",
          valueSuffix: "\\s*sun",
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
          valuePrefix,
          valueSuffix,
        } = testCase;

        const expressions = singleValueAttributeExpressionFactory({
          attributeNames: attributeNames,
          valuePrefix: valuePrefix,
          valueSuffix: valueSuffix,
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
