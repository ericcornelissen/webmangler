import type { CssDeclarationPropertyOptions } from "@webmangler/types";

import type { CssDeclarationValuesSets } from "../common";

import { generateValueObjectsAll } from "@webmangler/testing";
import { expect } from "chai";

import {
  buildCssComments,
  buildCssDeclarations,
  buildCssRuleset,
  getAllMatches,
  valuePresets,
} from "../common";

import expressionsFactory from "../../css-properties";

suite("CSS - CSS Property Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: CssDeclarationPropertyOptions;
    readonly expected: string[];
    getValuesSets(): CssDeclarationValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one declaration, no configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["color"],
      getValuesSets: () => [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["color"],
          afterProperty: valuePresets.afterProperty,
          value: valuePresets.value,
        },
      ],
    },
    {
      name: "one declaration, prefix configured",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "font-",
      },
      expected: ["family"],
      getValuesSets: () => [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["font-family"],
          afterProperty: valuePresets.afterProperty,
          value: valuePresets.value,
        },
      ],
    },
    {
      name: "one declaration, suffix configured",
      pattern: "[a-z]+",
      factoryOptions: {
        suffix: "-right",
      },
      expected: ["margin"],
      getValuesSets: () => [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["margin-right"],
          afterProperty: valuePresets.afterProperty,
          value: valuePresets.value,
        },
      ],
    },
    {
      name: "one declaration, prefix & suffix configured",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "--",
        suffix: "bar",
      },
      expected: ["foo"],
      getValuesSets: () => [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["--foobar"],
          afterProperty: valuePresets.afterProperty,
          value: valuePresets.value,
        },
      ],
    },
    {
      name: "two declarations, no configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["color", "font"],
      getValuesSets: () => [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["color"],
          afterProperty: valuePresets.afterProperty,
          value: ["red"],
        },
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["font"],
          afterProperty: valuePresets.afterProperty,
          value: ["serif"],
        },
      ],
    },
    {
      name: "two declarations, prefix configured",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "margin-",
      },
      expected: ["left", "right"],
      getValuesSets: () => [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["margin-left"],
          afterProperty: valuePresets.afterProperty,
          value: ["3px"],
        },
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["margin-right"],
          afterProperty: valuePresets.afterProperty,
          value: ["14px"],
        },
      ],
    },
    {
      name: "two declarations, suffix configured",
      pattern: "[a-z]+",
      factoryOptions: {
        suffix: "-top",
      },
      expected: ["margin", "padding"],
      getValuesSets: () => [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["margin-top"],
          afterProperty: valuePresets.afterProperty,
          value: ["3px"],
        },
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["padding-top"],
          afterProperty: valuePresets.afterProperty,
          value: ["14px"],
        },
      ],
    },
    {
      name: "declaration-like strings",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["content", "font"],
      getValuesSets: () => [
        {
          property: ["content"],
          value: [
            "\"color: violet;\"",
            "\"; color: purple;\"",
            "'color: green;'",
            "'; color: mint;'",
            "\" \\\" color: black; \"",
            "' \\' color: yellow; '",
          ],
        },
        {
          property: ["font"],
          value: valuePresets.value,
        },
      ],
    },
    {
      name: "declaration-like comments",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["content", "font"],
      getValuesSets: () => {
        const commentWithDeclarations = buildCssComments("color: violet;");

        return [
          {
            beforeProperty: [
              "",
              ...commentWithDeclarations,
            ],
            property: ["content"],
            value: valuePresets.value,
            afterValue: [
              "",
              ...commentWithDeclarations,
            ],
          },
          {
            beforeProperty: [
              "",
              ...commentWithDeclarations,
            ],
            property: ["font"],
            value: valuePresets.value,
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
