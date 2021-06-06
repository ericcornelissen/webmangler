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
          expected: ["data-foobar"],
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
          input: "<div data-hello='world'></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-hello"],
          options: null,
        },
        {
          input: "<div data-foo='baz' data-baz='foo'></div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo", "data-baz"],
          options: null,
        },
      ],
    },
    {
      name: "comments",
      cases: [
        {
          input: "<!--<div data-foobar></div>-->",
          pattern: "[a-z\\-]+",
          expected: [],
          options: null,
        },
        {
          input: "<!--<div data-foo=\"bar\"></div>-->",
          pattern: "[a-z\\-]+",
          expected: [],
          options: null,
        },
        {
          input: `
            <div data-foo="bar"></div>
            <!--<div data-foo="baz"></div>-->
          `,
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
        {
          input: `
            <!--<div data-foo="bar"></div>-->
            <div data-foo="baz"></div>
          `,
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
      ],
    },
    {
      name: "HTML content",
      cases: [
        {
          input: "<div data-foo>data-bar</div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
        {
          input: "<div data-foo=\"bar\">data-baz</div>",
          pattern: "[a-z\\-]+",
          expected: ["data-foo"],
          options: null,
        },
      ],
    },
    {
      name: "attribute value",
      cases: [
        {
          input: "<div id=\"data-foo\"></div>",
          pattern: "data-[a-z]+",
          expected: [],
          options: null,
        },
        {
          input: "<div id='data-foo'></div>",
          pattern: "data-[a-z]+",
          expected: [],
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
