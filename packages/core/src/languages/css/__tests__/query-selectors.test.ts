import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import querySelectorExpressionFactory from "../query-selectors";

type TestCase = {
  s: string;
  pattern: string;
  expected: string[];
  prefix: "\\." | "#";
};

suite("CSS - Query Selector Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          s: ".foobar { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          prefix: "\\.",
        },
        {
          s: ".foobar { }",
          pattern: "[a-z]+",
          expected: [],
          prefix: "#",
        },
        {
          s: "#foobar { }",
          pattern: "[a-z]+",
          expected: [],
          prefix: "\\.",
        },
        {
          s: "#foobar { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          prefix: "#",
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
        } = testCase;

        const expressions = querySelectorExpressionFactory({
          prefix:  prefix,
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
