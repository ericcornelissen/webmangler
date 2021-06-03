import type { CssDeclarationPropertyOptions } from "../../options";
import type { CssDeclarationValuesMap } from "./types";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";
import {
  createCssDeclarationBlock,
  createCssDeclarations,
  generateValueObjectsAll,
} from "./common";
import { valuePresets } from "./values";

import expressionsFactory from "../css-properties";

suite("CSS - CSS Property Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: CssDeclarationPropertyOptions;
    readonly expected: string[];
    readonly testValues: CssDeclarationValuesMap[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one declaration, no configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["color"],
      testValues: [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["color"],
          afterProperty: valuePresets.afterProperty,
          beforeValue: valuePresets.beforeValue,
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
      testValues: [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["font-family"],
          afterProperty: valuePresets.afterProperty,
          beforeValue: valuePresets.beforeValue,
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
      testValues: [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["margin-right"],
          afterProperty: valuePresets.afterProperty,
          beforeValue: valuePresets.beforeValue,
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
      testValues: [
        {
          beforeProperty: valuePresets.beforeProperty,
          property: ["--foobar"],
          afterProperty: valuePresets.afterProperty,
          beforeValue: valuePresets.beforeValue,
          value: valuePresets.value,
        },
      ],
    },
    {
      name: "two declarations, no configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["color", "font"],
      testValues: [
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
      testValues: [
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
      testValues: [
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
      testValues: [
        {
          property: ["content"],
          value: [
            "\"color: violet;\"",
            "\"; color: purple;\"",
            "'color: green;'",
            "'; color: mint;'",
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
      testValues: [
        {
          beforeProperty: [
            "",
            "/* color: violet; */",
            "/* ; color: purple; */",
          ],
          property: ["content"],
          value: valuePresets.value,
          afterValue: [
            "",
            "/* color: blue; */",
            "/* ; color: teal; */",
          ],
        },
        {
          beforeProperty: [
            "",
            "/* color: orange; */",
            "/* ; color: amber; */",
          ],
          property: ["font"],
          value: valuePresets.value,
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
        const input = createCssDeclarationBlock({
          selector: "div",
          declarations: createCssDeclarations(testCase),
        });

        const expressions = expressionsFactory(factoryOptions);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected, `in \`${input}\``);
      }
    });
  }
});
