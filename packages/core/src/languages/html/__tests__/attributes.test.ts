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
          input: "<div data-foobar></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foobar", "data-foobar"],
          options: null,
        },
        {
          input: "<div data-foo=\"bar\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-foo"],
          options: null,
        },
        {
          input: "<div data-foo=\"bar\" data-bar=\"foo\"></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-bar", "data-foo"],
          options: null,
        },
        {
          input: "<div data-hello='world'></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-hello", "data-hello"],
          options: null,
        },
        {
          input: "<div data-foo='baz' data-baz='foo'></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-foo", "data-baz"],
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
