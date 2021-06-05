import type { SingleValueAttributeOptions } from "../../options";
import type { CssDeclarationBlockMap } from "./types";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";
import { createCssDeclarationBlocks, generateValueObjectsAll } from "./common";
import {
  attributeSelectorOperators,
  valuePresets,
  selectorCombinators,
} from "./values";

import expressionsFactory from "../single-value-attributes";

suite("CSS - Single Value Attribute Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: SingleValueAttributeOptions;
    readonly expected: string[];
    readonly testValues: CssDeclarationBlockMap[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one selector, no prefix or suffix",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: ["bar"],
      testValues: [
        {
          beforeSelector: [
            ...valuePresets.beforeSelector,
            ...valuePresets.selectors,
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
      testValues: [
        {
          beforeSelector: [
            ...valuePresets.beforeSelector,
            ...valuePresets.selectors,
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
      testValues: [
        {
          beforeSelector: [
            ...valuePresets.beforeSelector,
            ...valuePresets.selectors,
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
      testValues: [
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
      testValues: [
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
      name: "attribute selector-like strings",
      pattern: "[a-z]+",
      factoryOptions: {
        attributeNames: ["data-foo"],
      },
      expected: [],
      testValues: [
        {
          selector: valuePresets.selectors,
          declarations: [
            "content: \"[data-foo='bar']\";",
            "content: '[data-foo=\"bar\"]';",
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
      testValues: [
        {
          beforeSelector: [
            "",
            "/* [data-foo=\"bar\"] */",
          ],
          selector: valuePresets.selectors,
          afterSelector: [
            "",
            "/* [data-foo=\"bar\"] */",
          ],
          declarations: [
            "",
            "/* [data-foo=\"bar\"] */",
          ],
        },
      ],
    },
  ];

  for (const scenario of scenarios) {
    const {
      name,
      pattern,
      factoryOptions,
      expected,
      testValues,
    } = scenario;

    test(name, function() {
      for (const testCase of generateValueObjectsAll(testValues)) {
        const input = createCssDeclarationBlocks(testCase);
        const expressions = expressionsFactory(factoryOptions);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected, `in \`${input}\``);
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
