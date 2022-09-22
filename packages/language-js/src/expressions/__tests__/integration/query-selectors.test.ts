import type { QuerySelectorOptions } from "@webmangler/types";

import type { JsStatementValuesSets } from "../common";

import { generateValueObjectsAll } from "@webmangler/testing";
import { expect } from "chai";

import {
  buildJsFunctionCall,
  buildJsStatements,
  buildJsInlineComments,
  buildJsLineComment,
  buildJsStrings,
  getAllMatches,
  valuePresets,
} from "../common";

import expressionsFactory from "../../query-selectors";

suite("JavaScript - Query Selector Expression Factory", function() {
  interface TestScenario {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: Pick<QuerySelectorOptions, "kind">;
    readonly expected: string[];
    getValuesSets(): JsStatementValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "without configuration",
      pattern: "[a-z]+",
      factoryOptions: {
        kind: "element",
      },
      expected: ["div"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("div"),
            ...buildJsStrings("div")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "with prefix, as CSS selector",
      pattern: "[a-z]+",
      factoryOptions: {
        kind: "class",
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings(".foobar"),
            ...buildJsStrings(".foobar")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "with prefix, as standalone string",
      pattern: "[a-z][0-9][a-z][0-9]",
      factoryOptions: {
        kind: "id",
      },
      expected: ["r2d2"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("r2d2"),
            ...buildJsStrings("r2d2")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "with suffix, as CSS selector",
      pattern: "[a-z]+",
      factoryOptions: {
        kind: "attribute",
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("[foobar]"),
            ...buildJsStrings("[foobar]")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "with suffix, as standalone string",
      pattern: "[a-z][0-9][a-z][0-9]",
      factoryOptions: {
        kind: "attribute",
      },
      expected: ["r2d2"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("r2d2"),
            ...buildJsStrings("r2d2")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "selector-like string in comments, no configuration",
      pattern: "[a-z]+",
      factoryOptions: {
        kind: "element",
      },
      expected: [],
      getValuesSets: () => {
        const inlineCommentOfSelectorString = buildJsStrings("div")
          .map(asQuerySelectorAll)
          .flatMap(buildJsInlineComments);

        return [
          {
            beforeLeftHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            beforeRightHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            afterStatement: [
              "",
              ...buildJsStrings("div")
                .map(asQuerySelectorAll)
                .map(buildJsLineComment),
            ],
          },
        ];
      },
    },
    {
      name: "selector-like string in comments, with prefix",
      pattern: "[a-z]+",
      factoryOptions: {
        kind: "class",
      },
      expected: [],
      getValuesSets: () => {
        const inlineCommentOfSelectorString = buildJsStrings(".foo")
          .map(asQuerySelectorAll)
          .flatMap(buildJsInlineComments);

        return [
          {
            beforeLeftHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            beforeRightHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            afterStatement: [
              "",
              ...buildJsStrings(".bar")
                .map(asQuerySelectorAll)
                .map(buildJsLineComment),
            ],
          },
        ];
      },
    },
    {
      name: "selector string with an extra quote",
      pattern: "cls-[a-z]+",
      factoryOptions: {
        kind: "class",
      },
      expected: [
        "cls-bar",
      ],
      getValuesSets: () => [
        {
          leftHand: valuePresets.leftHand,
          rightHand: [
            ...buildJsStrings("[data=\\'foo\"\\'] .cls-bar"),
            ...buildJsStrings("[data=\\\"foo'\\\"] .cls-bar"),
            ...buildJsStrings("[data=\\'foo`\\'] .cls-bar"),
          ],
        },
      ],
    },
    {
      name: "unrelated string with an extra quote",
      pattern: "cls-[a-z]+",
      factoryOptions: {
        kind: "class",
      },
      expected: [
        "cls-foobar",
      ],
      getValuesSets: () => {
        const stringsWithAQuote = [
          "\"foo\\\"bar\"",
          "'foo\\'bar'",
          "`foo\\`bar`",
        ];

        return [
          {
            beforeStatement: [
              "",
              ...stringsWithAQuote,
            ],
            leftHand: valuePresets.leftHand,
            rightHand: [
              ...buildJsStrings(".cls-foobar")
                .map(asQuerySelectorAll),
            ],
            afterStatement: [
              "",
              ...stringsWithAQuote,
            ],
          },
        ];
      },
    },
    {
      name: "no match due to unexpected character",
      pattern: "[a-z]+",
      factoryOptions: {
        kind: "element",
      },
      expected: [],
      getValuesSets: () => [
        {
          leftHand: valuePresets.leftHand,
          rightHand: [
            ...buildJsStrings("_div"),
            ...buildJsStrings("div_"),
          ],
        },
      ],
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

// We allow an extra top-level suite temporarily to keep the tests for the old
// functionality around until it's removed.
// eslint-disable-next-line mocha/max-top-level-suites
suite("JavaScript - Query Selector Expression Factory (old)", function() {
  interface TestScenario {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: Omit<QuerySelectorOptions, "kind">;
    readonly expected: string[];
    getValuesSets(): JsStatementValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "without configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["div"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("div"),
            ...buildJsStrings("div")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "with prefix, as CSS selector",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "\\.",
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings(".foobar"),
            ...buildJsStrings(".foobar")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "with prefix, as standalone string",
      pattern: "[a-z][0-9][a-z][0-9]",
      factoryOptions: {
        prefix: "\\#",
      },
      expected: ["r2d2"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("r2d2"),
            ...buildJsStrings("r2d2")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "with suffix, as CSS selector",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "\\[",
        suffix: "\\]",
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("[foobar]"),
            ...buildJsStrings("[foobar]")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "with suffix, as standalone string",
      pattern: "[a-z][0-9][a-z][0-9]",
      factoryOptions: {
        prefix: "\\[",
        suffix: "\\]",
      },
      expected: ["r2d2"],
      getValuesSets: () => [
        {
          beforeStatement: valuePresets.beforeStatement,
          leftHand: valuePresets.leftHand,
          beforeRightHand: valuePresets.beforeRightHand,
          rightHand: [
            ...buildJsStrings("r2d2"),
            ...buildJsStrings("r2d2")
              .map(asQuerySelectorAll),
          ],
          afterRightHand: valuePresets.afterRightHand,
          afterStatement: valuePresets.afterStatement,
        },
      ],
    },
    {
      name: "selector-like string in comments, no configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: [],
      getValuesSets: () => {
        const inlineCommentOfSelectorString = buildJsStrings("div")
          .map(asQuerySelectorAll)
          .flatMap(buildJsInlineComments);

        return [
          {
            beforeLeftHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            beforeRightHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            afterStatement: [
              "",
              ...buildJsStrings("div")
                .map(asQuerySelectorAll)
                .map(buildJsLineComment),
            ],
          },
        ];
      },
    },
    {
      name: "selector-like string in comments, with prefix",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "\\.",
      },
      expected: [],
      getValuesSets: () => {
        const inlineCommentOfSelectorString = buildJsStrings(".foo")
          .map(asQuerySelectorAll)
          .flatMap(buildJsInlineComments);

        return [
          {
            beforeLeftHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            beforeRightHand: [
              "",
              ...inlineCommentOfSelectorString,
            ],
            afterStatement: [
              "",
              ...buildJsStrings(".bar")
                .map(asQuerySelectorAll)
                .map(buildJsLineComment),
            ],
          },
        ];
      },
    },
    {
      name: "selector string with an extra quote",
      pattern: "cls-[a-z]+",
      factoryOptions: {
        prefix: "\\.",
      },
      expected: [
        "cls-bar",
      ],
      getValuesSets: () => [
        {
          leftHand: valuePresets.leftHand,
          rightHand: [
            ...buildJsStrings("[data=\\'foo\"\\'] .cls-bar"),
            ...buildJsStrings("[data=\\\"foo'\\\"] .cls-bar"),
            ...buildJsStrings("[data=\\'foo`\\'] .cls-bar"),
          ],
        },
      ],
    },
    {
      name: "unrelated string with an extra quote",
      pattern: "cls-[a-z]+",
      factoryOptions: {
        prefix: "\\.",
      },
      expected: [
        "cls-foobar",
      ],
      getValuesSets: () => {
        const stringsWithAQuote = [
          "\"foo\\\"bar\"",
          "'foo\\'bar'",
          "`foo\\`bar`",
        ];

        return [
          {
            beforeStatement: [
              "",
              ...stringsWithAQuote,
            ],
            leftHand: valuePresets.leftHand,
            rightHand: [
              ...buildJsStrings(".cls-foobar")
                .map(asQuerySelectorAll),
            ],
            afterStatement: [
              "",
              ...stringsWithAQuote,
            ],
          },
        ];
      },
    },
    {
      name: "no match due to unexpected character",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: [],
      getValuesSets: () => [
        {
          leftHand: valuePresets.leftHand,
          rightHand: [
            ...buildJsStrings("_div"),
            ...buildJsStrings("div_"),
          ],
        },
      ],
    },
  ];

  for (const scenario of scenarios) {
    const { name, pattern, factoryOptions, expected, getValuesSets } = scenario;
    test(name, function() {
      const valueSets = getValuesSets();
      for (const testCase of generateValueObjectsAll(valueSets)) {
        const input = buildJsStatements(testCase);
        const expressions = expressionsFactory(
          factoryOptions as QuerySelectorOptions,
        );
        const matches = getAllMatches(expressions, input, pattern);
        expect(matches).to.have.members(expected, `in \`${input}\``);
      }
    });
  }
});

/**
 * Convert a query selector string into a call to `document.querySelectorAll`.
 *
 * @param selectorStr The query selector string.
 * @returns A call to `document.querySelectorAll` as a string.
 */
function asQuerySelectorAll(selectorStr: string) {
  return buildJsFunctionCall({
    name: "document.querySelectorAll",
    args: selectorStr,
  });
}
