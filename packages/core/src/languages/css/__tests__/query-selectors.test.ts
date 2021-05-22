import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { QuerySelectorOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import querySelectorExpressionFactory from "../query-selectors";

suite("CSS - Query Selector Expression Factory", function() {
  const scenarios: TestScenario<TestCase<QuerySelectorOptions>>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "div { }",
          pattern: "[a-z]+",
          expected: ["div"],
          options: { },
        },
        {
          input: "bar, foobar, baz { }",
          pattern: "ba(r|z)",
          expected: ["bar", "baz"],
          options: { },
        },
        {
          input: ".foobar { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: "#foobar { }",
          pattern: "[a-z]+",
          expected: [],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: "#foobar { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "#",
          },
        },
        {
          input: "header, footer { }",
          pattern: "[a-z]+",
          expected: ["head", "foot"],
          options: {
            suffix: "er",
          },
        },
        {
          input: "[foobar] { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\[",
            suffix: "\\]",
          },
        },
      ],
    },
    {
      name: "nested",
      cases: [
        {
          input: "@media (max-width: 420px) { .foobar { } }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\.",
          },
        },
      ],
    },
    {
      name: "with comments",
      cases: [
        {
          input: "/* class selector */ .foobar { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: "#foobar /* id selector */ { }",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            prefix: "\\#",
          },
        },
        {
          input: ".foo, /* or */ .bar { }",
          pattern: "[a-z]+",
          expected: ["foo", "bar"],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: ".foo /* child */ > .bar { }",
          pattern: "[a-z]+",
          expected: ["foo", "bar"],
          options: {
            prefix: "\\.",
          },
        },
        {
          input: "#foo/*bar*/ { }",
          pattern: "[a-z]+",
          expected: ["foo"],
          options: {
            prefix: "\\#",
          },
        },{
          input: "/*foo*/bar { }",
          pattern: "[a-z]+",
          expected: ["bar"],
          options: { },
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
