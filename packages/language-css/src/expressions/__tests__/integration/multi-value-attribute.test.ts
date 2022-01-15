import type { TestScenarios } from "@webmangler/testing";
import type { MultiValueAttributeOptions } from "@webmangler/types";

import type { CssRulesetValuesSets } from "../common";

import { generateValueObjectsAll } from "@webmangler/testing";
import { expect } from "chai";

import {
  attributeSelectorOperators,
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
            selector: generateAttributeSelectors("data-foo", "bar"),
            afterSelector: valuePresets.afterSelector,
            declarations: valuePresets.declarations,
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
            selector: generateAttributeSelectors("data-foo", "bar baz"),
            afterSelector: valuePresets.afterSelector,
            declarations: valuePresets.declarations,
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
            selector: generateAttributeSelectors("class", "foo bar"),
            afterSelector: valuePresets.afterSelector,
            declarations: valuePresets.declarations,
          },
          {
            beforeSelector: [
              ...valuePresets.beforeSelector,
              ...valuePresets.selector,
            ],
            selector: generateAttributeSelectors("alt", "hello world"),
            afterSelector: valuePresets.afterSelector,
            declarations: valuePresets.declarations,
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
              ...Array.from(generateAttributeSelectors("alt", "foo bar"))
                .flatMap((selector1) => [
                  ...Array.from(generateAttributeSelectors("class", "hello world"))
                    .flatMap((selector2) => [
                      `${selector1}${selector2}`,
                      ...selectorCombinators.map(
                        (combinator) => `${selector1}${combinator}${selector2}`,
                      ),
                    ]),
                ]),
            ],
            declarations: valuePresets.declarations,
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
        expected: [
          "bar",
          "baz",
        ],
        getValuesSets: () => [
          {
            beforeRuleset: [
              ...sampleValues.mediaQueries.map((s) => `${s}{`),
            ],
            selector: generateAttributeSelectors("data-foo", "bar baz"),
            declarations: valuePresets.declarations,
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
              selector: valuePresets.selector,
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

/**
 * Generate valid attribute value selectors for a given attribute and value.
 *
 * @param attributeName The attribute name to use.
 * @param attributeValue The value to use.
 * @yields Attribute value selectors.
 */
function* generateAttributeSelectors(
  attributeName: string,
  attributeValue: string,
): IterableIterator<string> {
  for (const operator of attributeSelectorOperators) {
    for (const q of ["\"", "'"]) {
      yield `[${attributeName}${operator}${q}${attributeValue}${q}]`;
    }
  }
}
