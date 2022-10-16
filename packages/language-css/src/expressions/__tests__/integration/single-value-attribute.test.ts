import type { SingleValueAttributeOptions } from "@webmangler/types";

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

import expressionsFactory from "../../single-value-attributes";

suite("CSS - Single Value Attribute Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: SingleValueAttributeOptions;
    readonly expected: string[];
    getValuesSets(): CssRulesetValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one selector, no prefix or suffix",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: ["bar"],
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
    },
    {
      name: "one selector, with prefix",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-value"],
        valuePrefix: "foo",
      },
      expected: ["bar"],
      getValuesSets: () => [
        {
          beforeSelector: [
            ...valuePresets.beforeSelector,
            ...valuePresets.selector,
          ],
          selector: buildCssAttributeSelectors("data-value", "foobar"),
          afterSelector: valuePresets.afterSelector,
        },
      ],
    },
    {
      name: "one selector, with suffix",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-value"],
        valueSuffix: "bar",
      },
      expected: ["foo"],
      getValuesSets: () => [
        {
          beforeSelector: [
            ...valuePresets.beforeSelector,
            ...valuePresets.selector,
          ],
          selector: buildCssAttributeSelectors("data-value", "foobar"),
          afterSelector: valuePresets.afterSelector,
        },
      ],
    },
    {
      name: "multiple selectors in one block",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo", "data-hello"],
      },
      expected: ["bar", "world"],
      getValuesSets: () => [
        {
          selector: [
            ...Array.from(buildCssAttributeSelectors("data-foo", "bar"))
              .flatMap((selector1) => [
                ...Array.from(buildCssAttributeSelectors("data-hello", "world"))
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
    },
    {
      name: "multiple selectors in separate blocks",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo", "data-hello"],
      },
      expected: ["bar", "world"],
      getValuesSets: () => [
        {
          beforeSelector: valuePresets.beforeSelector,
          selector: buildCssAttributeSelectors("data-foo", "bar"),
          afterSelector: valuePresets.afterSelector,
        },
        {
          selector: buildCssAttributeSelectors("data-hello", "world"),
        },
      ],
    },
    {
      name: "selector in media query",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: [],
      getValuesSets: () => [
        {
          beforeRuleset: [
            ...sampleValues.mediaQueries.map((s) => `${s}{`),
          ],
          selector: buildCssAttributeSelectors("data-foo", "bar"),
          afterRuleset: ["}"],
        },
      ],
    },
    {
      name: "attribute selector-like strings",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: [],
      getValuesSets: () => [
        {
          selector: valuePresets.selector,
          declarations: [
            "content: \"[data-foo='bar']\";",
            "content: '[data-foo=\"bar\"]';",
            "content: \" \\\" [data-foo=\"bar\"]\";",
            "content: ' \\' [data-foo=\"bar\"]';",
          ],
        },
      ],
    },
    {
      name: "attribute selector-like comments",
      pattern: "[a-z]+",
      factoryOptions: {
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
    },
  ];

  for (const scenario of scenarios) {
    const { name, pattern, factoryOptions, expected, getValuesSets } = scenario;
    test(name, function() {
      const valuesSets = getValuesSets();
      for (const testCase of generateValueObjectsAll(valuesSets)) {
        const input = buildCssRulesets(testCase);
        const expressions = expressionsFactory(factoryOptions);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.have.members(expected, `in \`${input}\``);
      }
    });
  }
});
