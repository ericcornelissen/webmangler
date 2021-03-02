import type { TestScenario } from "@webmangler/testing";
import type { MultiValueAttributeOptions } from "../../options";

import { expect } from "chai";

import { matchesAsExpected } from "../../__tests__/test-helpers";

import multiValueAttributeExpressionFactory from "../multi-value-attributes";

type TestCase = {
  /**
   * The input string to match against.
   */
  input: string;

  /**
   * The pattern to use for matching.
   */
  pattern: string;

  /**
   * The expected matches.
   */
  expected: string[];

  /**
   * The factory options.
   */
  options: MultiValueAttributeOptions;
};

suite("HTML - Multi Value Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "<div class=\"foobar\"></div>",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            attributeNames: ["class"],
          },
        },
        {
          input: "<div class=\"foo bar\"></div>",
          pattern: "[a-z]+",
          expected: ["foo", "bar"],
          options: {
            attributeNames: ["class"],
          },
        },
        {
          input: "<div class=\"praise the sun\"></div>",
          pattern: "[a-z]{3}",
          expected: ["the", "sun"],
          options: {
            attributeNames: ["class"],
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

        const expressions = multiValueAttributeExpressionFactory(options);
        const result = matchesAsExpected(expressions, input, pattern, expected);
        expect(result).to.equal(true, `in "${input}"`);
      }
    });
  }
});
