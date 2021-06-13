import type { CssDeclarationPropertyOptions } from "../../options";
import type { JsStatementValuesSets } from "./types";

import { generateValueObjectsAll } from "@webmangler/testing";
import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";
import {
  buildJsFunctionCall,
  buildJsStatements,
  buildJsInlineComment,
  buildJsLineComment,
  buildJsStrings,
} from "./builders";
import { valuePresets } from "./values";

import expressionsFactory from "../css-properties";

suite("JavaScript - CSS Property Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: CssDeclarationPropertyOptions;
    readonly expected: string[];
    getValuesSets(): JsStatementValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "without configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["color"],
      getValuesSets: () => [
        {
          leftHand: valuePresets.leftHand,
          afterLeftHand: valuePresets.afterLeftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("color"),
            ...buildJsStrings("color")
              .map(asGetPropertyValue),
          ],
          afterRightHand: valuePresets.afterRightHand,
        },
      ],
    },
    {
      name: "with prefix",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "font-",
      },
      expected: ["size"],
      getValuesSets: () => [
        {
          leftHand: valuePresets.leftHand,
          afterLeftHand: valuePresets.afterLeftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("font-size"),
            ...buildJsStrings("font-size")
              .map(asGetPropertyValue),
          ],
          afterRightHand: valuePresets.afterRightHand,
        },
      ],
    },
    {
      name: "with suffix",
      pattern: "[a-z]+",
      factoryOptions: {
        suffix: "-left",
      },
      expected: ["margin"],
      getValuesSets: () => [
        {
          leftHand: valuePresets.leftHand,
          afterLeftHand: valuePresets.afterLeftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("margin-left"),
            ...buildJsStrings("margin-left")
              .map(asGetPropertyValue),
          ],
          afterRightHand: valuePresets.afterRightHand,
        },
      ],
    },
    {
      name: "property-like string in comments",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: [],
      getValuesSets: () => {
        const inlineCommentOfSelectorString = buildJsStrings("color")
          .map(asGetPropertyValue)
          .map(buildJsInlineComment);

        return [
          {
            beforeLeftHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            afterLeftHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            beforeRightHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            afterRightHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            afterStatement: [
              "",
              ...inlineCommentOfSelectorString,
              ...buildJsStrings("color")
                .map(asGetPropertyValue)
                .map(buildJsLineComment),
            ],
          },
        ];
      },
    },
  ];

  for (const scenario of scenarios) {
    const { name, pattern, factoryOptions, expected, getValuesSets } = scenario;
    test(name, function() {
      const valueSets = getValuesSets();
      for (const testCase of generateValueObjectsAll(valueSets)) {
        const input = buildJsStatements(testCase);
        const expressions = expressionsFactory(factoryOptions);
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.have.members(expected, `in \`${input}\``);
      }
    });
  }
});

/**
 * Convert an CSS property string into a call to `style.getPropertyValue`.
 *
 * @param propertyStr The CSS property string.
 * @returns A call to `style.getPropertyValue` as a string.
 */
function asGetPropertyValue(propertyStr: string) {
  return buildJsFunctionCall({
    name: "$element.style.getPropertyValue",
    args: propertyStr,
  });
}
