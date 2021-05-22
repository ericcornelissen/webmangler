import type { CssDeclarationValueOptions } from "../../options";
import type { CssDeclarationValuesMap } from "./types";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";
import {
  createDeclaration,
  createCssDeclarationBlock,
  generateValueObjects,
} from "./common";
import * as cssSampleValues from "./values";

import expressionsFactory from "../css-values";

suite("CSS - CSS Value Expression Factory", function() {
  type TestConfig = {
    readonly expected: string[];
    readonly factoryOptions: CssDeclarationValueOptions;
    readonly pattern: string;
  }

  const valuesToTestConfig: Map<string, TestConfig[]> = new Map([
    [
      "red",
      [
        {
          pattern: "[a-z]+",
          factoryOptions: { },
          expected: ["red"],
        },
      ],
    ],
    [
      "42px",
      [
        {
          pattern: "[0-9]+",
          factoryOptions: { suffix: "px" },
          expected: ["42"],
        },
        {
          pattern: "[a-z]+",
          factoryOptions: { prefix: "[0-9]+" },
          expected: ["px"],
        },
      ],
    ],
    [
      "0 3px 0 14px",
      [
        {
          pattern: "[0-9]+",
          factoryOptions: { suffix: "px" },
          expected: ["3", "14"],
        },
      ],
    ],
  ]);

  const declarationValueOptions: CssDeclarationValuesMap = {
    property: [
      ...cssSampleValues.propertyNames,
    ],
    beforeValue: [
      ...cssSampleValues.whitespace,
      ...cssSampleValues.comments,
    ],
    value: valuesToTestConfig.keys(),
    afterValue: [
      ...cssSampleValues.whitespace,
      ...cssSampleValues.comments,
      ...cssSampleValues.importantRule,
    ],
  };

  test("all generated", function() {
    for (const testCase of generateValueObjects(declarationValueOptions)) {
      const testCaseConfigs = valuesToTestConfig.get(testCase.value);
      if (testCaseConfigs === undefined) {
        expect.fail(`missing test config for value "${testCase.value}"`);
      }

      for (const testCaseConfig of testCaseConfigs) {
        const { expected, factoryOptions, pattern } = testCaseConfig;

        const input = createCssDeclarationBlock({
          selector: "div",
          declarations: createDeclaration(testCase),
        });

        const expressions = expressionsFactory(factoryOptions);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.deep.equal(expected, `in \`${input}\``);
      }
    }
  });
});
