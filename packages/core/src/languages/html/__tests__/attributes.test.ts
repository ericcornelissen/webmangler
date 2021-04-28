import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { AttributeOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import attributeExpressionFactory from "../attributes";

suite("HTML - Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase<AttributeOptions>>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "<div data-foo></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
        {
          input: "<div data-foo=\"bar\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
        {
          input: "<div data-foo=\"bar\" data-bar=\"foo\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-bar"],
          options: null,
        },
        {
          input: "<div data-foo='bar'></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
        {
          input: "<div data-foo='bar' data-bar='foo'></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-bar"],
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
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected);
      }
    });
  }
});
