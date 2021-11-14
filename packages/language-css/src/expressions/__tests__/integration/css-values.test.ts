import type { CssDeclarationValueOptions } from "@webmangler/types";

import type { CssDeclarationValuesSets } from "../common";

import { generateValueObjectsAll } from "@webmangler/testing";
import { expect } from "chai";

import {
  buildCssDeclarations,
  buildCssRuleset,
  getAllMatches,
  sampleValues,
  valuePresets,
} from "../common";

import expressionsFactory from "../../css-values";

suite("CSS - CSS Value Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: CssDeclarationValueOptions;
    readonly expected: string[];
    getValuesSets(): CssDeclarationValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one declaration, no configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["red"],
      getValuesSets: () => [
        {
          property: valuePresets.property,
          beforeValue: valuePresets.beforeValue,
          value: ["red"],
          afterValue: valuePresets.afterValue,
        },
      ],
    },
    {
      name: "one declaration, prefix configured",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "[0-9]+",
      },
      expected: ["px"],
      getValuesSets: () => [
        {
          property: valuePresets.property,
          beforeValue: valuePresets.beforeValue,
          value: ["42px"],
          afterValue: valuePresets.afterValue,
        },
      ],
    },
    {
      name: "one declaration, suffix configured",
      pattern: "[0-9]+",
      factoryOptions: {
        suffix: "px",
      },
      expected: ["36"],
      getValuesSets: () => [
        {
          property: valuePresets.property,
          beforeValue: valuePresets.beforeValue,
          value: ["36px"],
          afterValue: valuePresets.afterValue,
        },
      ],
    },
    {
      name: "one declaration in a CSS function",
      pattern: "[0-9]+px",
      factoryOptions: { },
      expected: ["42px"],
      getValuesSets: () => [
        {
          beforeValue: [
            "calc(",
            "calc(1em+",
            "calc(2%-",
            "calc(3vh-",
            "calc(4/",
            "minmax(36em,",
            "3.14em calc(",
          ].flatMap((s) => [s, `${s} `]),
          value: ["42px"],
          afterValue: [
            ")",
            "+1em)",
            "-2%)",
            "*3vh)",
            "/4)",
            ",min-content)",
            ") 2.718em",
          ].flatMap((s) => [s, ` ${s}`]),
        },
      ],
    },
    {
      name: "one declaration, multi-value",
      pattern: "[0-9]+",
      factoryOptions: {
        suffix: "px",
      },
      expected: ["3", "14"],
      getValuesSets: () => [
        {
          property: valuePresets.property,
          beforeValue: valuePresets.beforeValue,
          value: ["0 3px 0 14px"],
          afterValue: valuePresets.afterValue,
        },
      ],
    },
    {
      name: "declaration between strings and comments",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["red"],
      getValuesSets: () => [
        {
          property: ["content"],
          value: [
            "\"foo\"",
            "'foo'",
          ],
          afterValue: sampleValues.comments,
        },
        {
          property: ["color"],
          value: ["red"],
        },
        {
          beforeProperty: sampleValues.comments,
          property: ["content"],
          value: [
            "\"bar\"",
            "'bar'",
          ],
        },
      ],
    },
    {
      name: "declaration-like strings",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["red"],
      getValuesSets: () => [
        {
          property: ["content"],
          value: [
            "\"color: blue;\"",
            "\"; color: teal;\"",
            "'color: yellow;'",
            "'; color: orange;'",
          ],
        },
        {
          property: valuePresets.property,
          value: ["red"],
        },
      ],
    },
    {
      name: "declaration-like comments",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["red"],
      getValuesSets: () => {
        const commentWithDeclarations = [
          "/* color: green; */",
          "/* ; color: mint; */",
          "/* * color: mint; */",
          "/* / color: mint; */",
        ];

        return [
          {
            beforeProperty: [
              "",
              ...commentWithDeclarations,
            ],
            property: ["padding"],
            afterProperty: [
              "",
              ...commentWithDeclarations,
            ],
            beforeValue: [
              "",
              ...commentWithDeclarations,
            ],
            value: ["42px"],
            afterValue: [
              "",
              ...commentWithDeclarations,
            ],
          },
          {
            property: valuePresets.property,
            value: ["red"],
          },
        ];
      },
    },
    {
      name: "value-like strings",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "var\\(--",
        suffix: "\\)",
      },
      expected: [],
      getValuesSets: () => [
        {
          property: ["content"],
          value: [
            "\" var(--foobar) \"",
            "' var(--foobar) '",
            "\"foo \\\" var(--bar) \"",
            "'foo \\' var(--bar) '",
          ],
        },
      ],
    },
  ];

  for (const scenario of scenarios) {
    const { name, pattern, factoryOptions, expected, getValuesSets } = scenario;
    test(name, function() {
      const valuesSets = getValuesSets();
      for (const testCase of generateValueObjectsAll(valuesSets)) {
        const input = buildCssRuleset({
          selector: "div",
          declarations: buildCssDeclarations(testCase),
        });

        const expressions = expressionsFactory(factoryOptions);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.have.members(expected, `in \`${input}\``);
      }
    });
  }
});
