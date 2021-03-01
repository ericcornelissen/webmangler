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

suite("HTML - Single Value Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          s: "<div id=\"foobar\"></div>",
          attributeNames: ["id"],
          pattern: "[a-z]+",
          expected: ["foobar"],
        },
        {
          s: "<div id=\"foo\"><div id=\"bar\"></div></div>",
          attributeNames: ["id"],
          pattern: "[a-z]+",
          expected: ["foo", "bar"],
        },
        {
          s: "<div id=\"foobar\"></div>",
          attributeNames: ["id"],
          pattern: "[a-z]+",
          expected: ["bar"],
          valuePrefix: "foo",
        },
        {
          s: "<div id=\"foobar\"></div>",
          attributeNames: ["id"],
          pattern: "[a-z]+",
          expected: ["foo"],
          valueSuffix: "bar",
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
