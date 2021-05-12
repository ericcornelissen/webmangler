import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { QuerySelectorOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import querySelectorExpressionFactory from "../query-selectors";

suite("JavaScript - Query Selector Expression Factory", function() {
  const scenarios: TestScenario<TestCase<QuerySelectorOptions>>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "document.querySelectorAll(\"div\");",
          pattern: "[a-z]+",
          expected: ["div"],
          options: { },
        },
        {
          input: "document.querySelectorAll(\"bar > foobar > baz\");",
          pattern: "ba(r|z)",
          expected: ["bar", "baz"],
          options: { },
        },
        {
          input: "document.querySelectorAll(\".foobar\");",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: "document.querySelectorAll(\".foobar\");",
          pattern: "[a-z]+",
          expected: [],
          options: {
            prefix: "#",
          },
        },
        {
          input: "document.querySelectorAll(\"#foobar\");",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "#",
          },
        },
        {
          input: "document.querySelectorAll(\"[foobar]\");",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\[",
            suffix: "\\]",
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

        const expressions = querySelectorExpressionFactory(options);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected);
      }
    });
  }
});
