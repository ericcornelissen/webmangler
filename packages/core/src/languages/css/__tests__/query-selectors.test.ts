import type { QuerySelectorOptions } from "../../options";
import type { CssDeclarationBlockMap } from "./types";

import { expect } from "chai";

import { getAllMatches } from "../../__tests__/test-helpers";
import { createCssDeclarationBlocks, generateValueObjectsAll } from "./common";
import { valuePresets } from "./values";

import expressionsFactory from "../query-selectors";

suite("CSS - Query Selector Expression Factory", function() {
  type TestScenario = {
    readonly name: string;
    readonly pattern: string;
    readonly factoryOptions: QuerySelectorOptions;
    readonly expected: string[];
    readonly testValues: CssDeclarationBlockMap[];
  }

  const scenarios: TestScenario[] = [
    {
      name: "one selector, no configuration",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["div"],
      testValues: [
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
      testValues: [
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
      testValues: [
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
      testValues: [
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
      testValues: [
        {
          beforeSelector: valuePresets.beforeSelector,
          selector: [
            ".foo.bar",
            ".foo .bar",
            ".foo, .bar",
            ".foo > .bar",
            ".foo ~ .bar",
            ".foo + .bar",
          ],
          afterSelector: valuePresets.afterSelector,
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
      testValues: [
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
      name: "selector-like strings",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["div"],
      testValues: [
        {
          selector: ["div"],
          declarations: [
            "content: \"span { }\";",
            "content: \"} main {\";",
          ],
        },
        {
          selector: [
            "[data-foo=\"bar\"]",
            "[data-hello=\"world { }\"]",
            "[data-value=\"} header {\"]",
          ],
        },
      ],
    },
    {
      name: "selector-like comments",
      pattern: "[a-z]+",
      factoryOptions: { },
      expected: ["div"],
      testValues: [
        {
          beforeSelector: [
            "",
            "/* header { } */",
            "/* } footer { } */",
            "/* main, */",
            "/* } aside > */",
          ],
          selector: ["div"],
          afterSelector: [
            "",
            "/*, span */",
            "/* { } img */",
          ],
          declarations: valuePresets.declarations,
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
