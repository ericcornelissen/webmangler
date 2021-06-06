import type { CssDeclarationValues, CssRulesetValues } from "./types";

import { expect } from "chai";

import {
  buildCssDeclaration,
  buildCssDeclarations,
  buildCssRuleset,
  buildCssRulesets,
} from "./builders";

suite("CSS expression factory test suite string builders", function() {
  suite("::buildCssDeclaration", function() {
    const DEFAULT_PROPERTY = "color";
    const DEFAULT_VALUE = "red";

    type TestCase = {
      expected: string;
      input: CssDeclarationValues;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no values",
        input: { },
        expected: `${DEFAULT_PROPERTY}:${DEFAULT_VALUE};`,
      },
      {
        name: "only a property",
        input: {
          property: "font",
        },
        expected: `font:${DEFAULT_VALUE};`,
      },
      {
        name: "only a value",
        input: {
          value: "serif",
        },
        expected: `${DEFAULT_PROPERTY}:serif;`,
      },
      {
        name: "only a property and value",
        input: {
          property: "font",
          value: "serif",
        },
        expected: "font:serif;",
      },
      {
        name: "property with before and after",
        input: {
          beforeProperty: "/* Hello */",
          property: "margin",
          afterProperty: "/* world! */",
        },
        expected: `/* Hello */margin/* world! */:${DEFAULT_VALUE};`,
      },
      {
        name: "value with before and after",
        input: {
          beforeValue: "/* foo */",
          value: "42px",
          afterValue: "/* bar */",
        },
        expected: `${DEFAULT_PROPERTY}:/* foo */42px/* bar */;`,
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildCssDeclaration(input);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::buildCssDeclarations", function() {
    type TestCase = {
      expected: string;
      input: CssDeclarationValues[];
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no values",
        input: [],
        expected: "",
      },
      {
        name: "one declaration",
        input: [
          {
            property: "font",
            value: "serif",
          },
        ],
        expected: "font:serif;",
      },
      {
        name: "multiple declarations",
        input: [
          {
            property: "margin",
            value: "3px",
          },
          {
            property: "padding",
            value: "14px",
          },
        ],
        expected: "margin:3px;padding:14px;",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildCssDeclarations(input);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::buildCssRuleset", function() {
    const DEFAULT_SELECTOR = "div";

    type TestCase = {
      expected: string;
      input: CssRulesetValues;
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no values",
        input: { },
        expected: `${DEFAULT_SELECTOR}{}`,
      },
      {
        name: "only a selector",
        input: {
          selector: ".foo, #bar",
        },
        expected: ".foo, #bar{}",
      },
      {
        name: "only declarations",
        input: {
          declarations: "color: red; font: serif;",
        },
        expected: `${DEFAULT_SELECTOR}{color: red; font: serif;}`,
      },
      {
        name: "selector with before and after",
        input: {
          beforeSelector: "/* Hello */",
          selector: "[data-foo=\"bar\"]",
          afterSelector: "/* world! */",
        },
        expected: "/* Hello */[data-foo=\"bar\"]/* world! */{}",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildCssRuleset(input);
        expect(result).to.equal(expected);
      });
    }
  });

  suite("::buildCssRulesets", function() {
    type TestCase = {
      expected: string;
      input: CssRulesetValues[];
      name: string;
    };

    const testCases: TestCase[] = [
      {
        name: "no values",
        input: [],
        expected: "",
      },
      {
        name: "one ruleset",
        input: [
          {
            selector: ".foo, #bar",
          },
        ],
        expected: ".foo, #bar{}",
      },
      {
        name: "multiple rulesets",
        input: [
          {
            selector: ".foo",
          },
          {
            selector: "#bar",
          },
        ],
        expected: ".foo{}#bar{}",
      },
    ];

    for (const testCase of testCases) {
      const { expected, input, name } = testCase;
      test(name, function() {
        const result = buildCssRulesets(input);
        expect(result).to.equal(expected);
      });
    }
  });
});
