import type { TestScenario } from "@webmangler/testing";
import type { TestCase } from "../../__tests__/test-types";
import type { SingleValueAttributeOptions } from "../../options";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";

import singleValueAttributeExpressionFactory from "../single-value-attributes";

suite("HTML - Single Value Attribute Expression Factory", function() {
  const scenarios: TestScenario<TestCase<SingleValueAttributeOptions>>[] = [
    {
      name: "sample",
      cases: [
        {
          input: "<div id=\"foobar\"></div>",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            attributeNames: ["id"],
          },
        },
        {
          input: "<div id=\"foo\"><div id=\"bar\"></div></div>",
          pattern: "[a-z]+",
          expected: ["foo", "bar"],
          options: {
            attributeNames: ["id"],
          },
        },
        {
          input: "<div id=\"foobar\"></div>",
          pattern: "[a-z]+",
          expected: ["bar"],
          options: {
            attributeNames: ["id"],
            valuePrefix: "foo",
          },
        },
        {
          input: "<div id=\"foobar\"></div>",
          pattern: "[a-z]+",
          expected: ["foo"],
          options: {
            attributeNames: ["id"],
            valueSuffix: "bar",
          },
        },
        {
          input: "<div id=foobar></div>",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            attributeNames: ["id"],
          },
        },
        {
          input: "<div id=foo class=\"bar\"></div>",
          pattern: "[a-z]+",
          expected: ["foo"],
          options: {
            attributeNames: ["id"],
          },
        },
        {
          input: "<img id=foobar/>",
          pattern: "[a-z]+",
          expected: ["foobar"],
          options: {
            attributeNames: ["id"],
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

        const expressions = singleValueAttributeExpressionFactory(options);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected);
      }
    });
  }
});
