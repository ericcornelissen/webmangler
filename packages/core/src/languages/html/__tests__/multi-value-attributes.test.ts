import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { MultiValueAttributeOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import multiValueAttributeExpressionFactory from "../multi-value-attributes";

suite("HTML - Multi Value Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase<MultiValueAttributeOptions>>[] = [
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
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected);
      }
    });
  }
});
