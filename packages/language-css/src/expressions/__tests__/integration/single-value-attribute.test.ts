import type { SingleValueAttributeOptions } from "../../../options";
import type { CssRulesetValuesSets } from "../common";

import { generateValueObjectsAll } from "@webmangler/testing";
import { expect } from "chai";

import {
  attributeSelectorOperators,
  buildCssRulesets,
  getAllMatches,
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
          selector: generateAttributeSelectors("data-foo", "bar"),
          afterSelector: valuePresets.afterSelector,
          declarations: valuePresets.declarations,
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
          selector: generateAttributeSelectors("data-value", "foobar"),
          afterSelector: valuePresets.afterSelector,
          declarations: valuePresets.declarations,
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
          selector: generateAttributeSelectors("data-value", "foobar"),
          afterSelector: valuePresets.afterSelector,
          declarations: valuePresets.declarations,
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
            ...Array.from(generateAttributeSelectors("data-foo", "bar"))
              .flatMap((selector1) => [
                ...Array.from(generateAttributeSelectors("data-hello", "world"))
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
          selector: generateAttributeSelectors("data-foo", "bar"),
          declarations: valuePresets.declarations,
        },
        {
          selector: generateAttributeSelectors("data-hello", "world"),
          declarations: valuePresets.declarations,
        },
      ],
    },
    {
      name: "selector in media query",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: ["bar"],
      getValuesSets: () => [
        {
          beforeRuleset: ["@media (screen) {"],
          selector: generateAttributeSelectors("data-foo", "bar"),
          declarations: valuePresets.declarations,
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
          "/* [data-foo=\"bar\"] */",
          "/* [data-foo='bar'] */",
          "/* * [data-foo='bar'] */",
          "/* / [data-foo='bar'] */",
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
