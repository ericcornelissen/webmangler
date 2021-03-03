import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { AttributeOptions } from "../../options";

import { expect } from "chai";

import { matchesAsExpected } from "../../__tests__/test-helpers";

import attributeExpressionFactory from "../attributes";

suite("JavaScript - Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase<AttributeOptions>>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "document.querySelectorAll(\"[data-foo]\");",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
        {
          input: "$element.getAttribute(\"data-bar\");",
          pattern: "[a-z\\-]+",
          expected: ["data-bar"],
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
