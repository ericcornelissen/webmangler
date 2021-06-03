import type { CssDeclarationValueOptions } from "../../options";
import type { CssDeclarationValuesMap } from "./types";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";
import {
  createCssDeclarationBlock,
  createCssDeclarations,
  generateValueObjectsAll,
} from "./common";
import { valuePresets } from "./values";

import expressionsFactory from "../css-values";

suite("CSS - CSS Value Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: CssDeclarationValueOptions;
    readonly expected: string[];
    readonly testValues: CssDeclarationValuesMap[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one declaration, no configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["red"],
      testValues: [
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
      testValues: [
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
      testValues: [
        {
          property: valuePresets.property,
          beforeValue: valuePresets.beforeValue,
          value: ["36px"],
          afterValue: valuePresets.afterValue,
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
      testValues: [
        {
          property: valuePresets.property,
          beforeValue: valuePresets.beforeValue,
          value: ["0 3px 0 14px"],
          afterValue: valuePresets.afterValue,
        },
      ],
    },
    {
      name: "declaration-like strings",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["red"],
      testValues: [
        {
          property: "content",
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
      testValues: [
        {
          beforeProperty: [
            "",
            "/* color: green; */",
            "/* ; color: mint; */",
          ],
          property: "padding",
          afterProperty: [
            "",
            "/* color: black; */",
            "/* ; color: yellow; */",
          ],
          beforeValue: [
            "",
            "/* color: blue; */",
            "/* ; color: teal; */",
          ],
          value: ["42px"],
          afterValue: [
            "",
            "/* color: yellow; */",
            "/* ; color: orange; */",
          ],
        },
        {
          property: valuePresets.property,
          value: ["red"],
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
