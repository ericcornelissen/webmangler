import type { TestScenarios } from "@webmangler/testing";
import type { MultiValueAttributeOptions } from "@webmangler/types";

import type { CssRulesetValuesSets } from "../common";

import { generateValueObjectsAll } from "@webmangler/testing";
import { expect } from "chai";

import {
  buildCssAttributeSelectors,
  buildCssComments,
  buildCssRulesets,
  getAllMatches,
  sampleValues,
  selectorCombinators,
  valuePresets,
} from "../common";

import { multiValueAttributeExpressionFactory } from "../../index";

suite("CSS - Multi Value Attribute Expression Factory", function() {
  interface TestCase {
    readonly pattern: string;
    readonly options: MultiValueAttributeOptions;
    readonly expected: string[];
    getValuesSets(): CssRulesetValuesSets[];
  }

  const scenarios: TestScenarios<TestCase> = [
    {
      testName: "one selector, one value",
      getScenario: () => ({
        pattern: "[a-z]+",
        options: {
          attributeNames: ["data-foo"],
        },
        expected: [
          "bar",
        ],
        getValuesSets: () => [
          {
            beforeSelector: [
              ...valuePresets.beforeSelector,
              ...valuePresets.selector,
            ],
            selector: buildCssAttributeSelectors("data-foo", "bar"),
            afterSelector: valuePresets.afterSelector,
          },
        ],
      }),
    },
    {
      testName: "one selector, multiple value",
      getScenario: () => ({
        pattern: "[a-z]+",
        options: {
          attributeNames: ["data-foo"],
        },
        expected: [
          "bar",
          "baz",
        ],
        getValuesSets: () => [
          {
            beforeSelector: [
              ...valuePresets.beforeSelector,
              ...valuePresets.selector,
            ],
            selector: buildCssAttributeSelectors("data-foo", "bar baz"),
            afterSelector: valuePresets.afterSelector,
          },
        ],
      }),
    },
    {
      testName: "multiple adjacent selector, one attribute",
      getScenario: () => ({
        pattern: "[a-z]+",
        options: {
          attributeNames: ["alt", "class"],
        },
        expected: [
          "foo",
          "bar",
          "hello",
          "world",
        ],
        getValuesSets: () => [
          {
            beforeSelector: [
              ...valuePresets.beforeSelector,
              ...valuePresets.selector,
            ],
            selector: buildCssAttributeSelectors("class", "foo bar"),
            afterSelector: valuePresets.afterSelector,
          },
          {
            selector: buildCssAttributeSelectors("alt", "hello world"),
          },
        ],
      }),
    },
    {
      testName: "multiple joined selector, one attribute",
      getScenario: () => ({
        pattern: "[a-z]+",
        options: {
          attributeNames: ["alt", "class"],
        },
        expected: [
          "foo",
          "bar",
          "hello",
          "world",
        ],
        getValuesSets: () => [
          {
            selector: [
              ...Array.from(buildCssAttributeSelectors("alt", "foo bar"))
                .flatMap((selector1) => [
                  ...Array.from(buildCssAttributeSelectors("class", "hello world"))
                    .flatMap((selector2) => [
                      `${selector1}${selector2}`,
                      ...selectorCombinators.map(
                        (combinator) => `${selector1}${combinator}${selector2}`,
                      ),
                    ]),
                ]),
            ],
          },
        ],
      }),
    },
    {
      testName: "selector in media query",
      getScenario: () => ({
        pattern: "[a-z]+",
        options: {
          attributeNames: ["data-foo"],
        },
        expected: [],
        getValuesSets: () => [
          {
            beforeRuleset: [
              ...sampleValues.mediaQueries.map((s) => `${s}{`),
            ],
            selector: buildCssAttributeSelectors("data-foo", "bar baz"),
            afterRuleset: ["}"],
          },
        ],
      }),
    },
    {
      testName: "attribute selector-like strings",
      getScenario: () => ({
        pattern: "[a-z]+",
        options: {
          attributeNames: ["data-foo"],
        },
        expected: [],
        getValuesSets: () => [
          {
            selector: valuePresets.selector,
            declarations: [
              "content: \"[data-foo='bar baz']\";",
              "content: '[data-foo=\"bar baz\"]';",
              "content: \" \\\" [data-foo=\"bar baz\"]\";",
              "content: ' \\' [data-foo=\"bar baz\"]';",
            ],
          },
        ],
      }),
    },
    {
      testName: "attribute selector-like comments",
      getScenario: () => ({
        pattern: "[a-z]+",
        options: {
          attributeNames: ["data-foo"],
        },
        expected: [],
        getValuesSets: () => {
          const commentWithAttributeSelector = [
            ...buildCssComments("[data-foo=\"bar\"]"),
            ...buildCssComments("[data-foo='bar']"),
          ];

          return [
            {
              beforeSelector: [
                "",
                ...commentWithAttributeSelector,
              ],
              selector: ["div"],
              afterSelector: [
                "",
                ...commentWithAttributeSelector,
              ],
              declarations: [
                "",
                ...commentWithAttributeSelector,
              ],
            },
          ];
        },
      }),
    },
  ];

  for (const { getScenario, testName } of scenarios) {
    test(testName, function() {
      const { pattern, options, expected, getValuesSets } = getScenario();
      const valuesSets = getValuesSets();
      for (const testCase of generateValueObjectsAll(valuesSets)) {
        const input = buildCssRulesets(testCase);
        const expressions = multiValueAttributeExpressionFactory(options);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.have.members(expected, `in \`${input}\``);
      }
    });
  }
});
