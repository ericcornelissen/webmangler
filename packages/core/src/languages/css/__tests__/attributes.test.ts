import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { AttributeOptions } from "../../options";

import { expect } from "chai";

import { matchesAsExpected } from "../../__tests__/test-helpers";

import attributeExpressionFactory from "../attributes";

suite("CSS - Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase<AttributeOptions>>[] = [
    {
      name: "attribute usage",
      cases: [
        {
          input: "div { content: attr(data-foo); }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
        {
          input: "div { content: attr(data-foo, \"bar\"); }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
        {
          input: "div { content: attr(data-foo px); }",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
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
        } = testCase;

        const expressions = attributeExpressionFactory();
        const result = matchesAsExpected(expressions, input, pattern, expected);
        expect(result).to.equal(true, `in "${input}"`);
      }
    });
  }
});
