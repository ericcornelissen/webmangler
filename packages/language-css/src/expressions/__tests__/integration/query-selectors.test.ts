import type { QuerySelectorOptions } from "@webmangler/types";

import type { CssRulesetValuesSets } from "../common";

import { generateValueObjectsAll } from "@webmangler/testing";
import { expect } from "chai";

import {
  buildCssComments,
  buildCssRulesets,
  getAllMatches,
  valuePresets,
  sampleValues,
  selectorCombinators,
} from "../common";

import expressionsFactory from "../../query-selectors";

suite("CSS - Query Selector Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: QuerySelectorOptions;
    readonly expected: string[];
    getValuesSets(): CssRulesetValuesSets[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one selector, no configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["div"],
      getValuesSets: () => [
        {
          beforeSelector: valuePresets.beforeSelector,
          selector: ["div"],
          afterSelector: valuePresets.afterSelector,
          declarations: valuePresets.declarations,
        },
      ],
    },
    {
      name: "one selector, prefix configured",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "\\.",
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeSelector: valuePresets.beforeSelector,
          selector: [".foobar"],
          afterSelector: valuePresets.afterSelector,
          declarations: valuePresets.declarations,
        },
      ],
    },
    {
      name: "one selector, prefix & suffix configured",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "\\#",
        suffix: "er",
      },
      expected: ["head"],
      getValuesSets: () => [
        {
          beforeSelector: valuePresets.beforeSelector,
          selector: ["#header"],
          afterSelector: valuePresets.afterSelector,
          declarations: valuePresets.declarations,
        },
      ],
    },
    {
      // TODO: find better approach for testing nested selectors
      name: "nested selectors",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "\\.",
      },
      expected: ["foo"],
      getValuesSets: () => [
        {
          beforeSelector: valuePresets.beforeSelector,
          selector: [
            "@media only screen",
            "@media (max-width: 420px)",
          ],
          afterSelector: valuePresets.afterSelector,
          declarations: [".foo { }"],
        },
      ],
    },
    {
      name: "multiple selectors in one block",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "\\.",
      },
      expected: ["foo", "bar"],
      getValuesSets: () => [
        {
          selector: [
            ".foo.bar",
            ...selectorCombinators.map((combinator) => `.foo${combinator}.bar`),
          ],
          declarations: valuePresets.declarations,
        },
      ],
    },
    {
      name: "multiple selectors in separate blocks",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "\\#",
      },
      expected: ["foo", "bar"],
      getValuesSets: () => [
        {
          selector: ["#foo"],
          declarations: valuePresets.declarations,
        },
        {
          selector: ["#bar"],
          declarations: valuePresets.declarations,
        },
      ],
    },
    {
      name: "selector in media query",
      pattern: "[a-z]+",
      factoryOptions: {
        prefix: "\\.",
      },
      expected: ["foobar"],
      getValuesSets: () => [
        {
          beforeRuleset: [
            ...sampleValues.mediaQueries.map((s) => `${s}{`),
          ],
          selector: [".foobar"],
          declarations: valuePresets.declarations,
          afterRuleset: ["}"],
        },
      ],
    },
    {
      name: "selector-like strings",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["div"],
      getValuesSets: () => [
        {
          selector: ["div"],
          declarations: [
            "",
            "content: \"span { }\";",
            "content: \"} main {\";",
            "content: \" \\\" div { }\";",
          ],
        },
        {
          selector: [
            ":root",
            "[data-foo=\"bar\"]",
            "[data-hello=\"world { }\"]",
            "[data-value=\"} header {\"]",
            "[data-value=\" \\\" footer {\"]",
          ],
        },
      ],
    },
    {
      name: "selector-like comments",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["div"],
      getValuesSets: () => {
        const commentWithSelector = buildCssComments("header { }");

        return [
          {
            beforeSelector: [
              "",
              ...commentWithSelector,
            ],
            selector: ["div"],
            afterSelector: [
              "",
              ...commentWithSelector,
            ],
            declarations: valuePresets.declarations,
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
