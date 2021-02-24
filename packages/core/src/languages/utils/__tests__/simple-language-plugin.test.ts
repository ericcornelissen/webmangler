import type { TestScenario } from "@webmangler/testing";
import type { MangleExpression } from "../../../types";

import { expect } from "chai";

import MangleExpressionMock from "../../../__mocks__/mangle-expression.mock";

import SimpleLanguagePlugin from "../simple-language-plugin.class";

class ConcretePlugin extends SimpleLanguagePlugin {
  constructor(
    languages: string[],
    expressions: Map<string, MangleExpression[]>,
  ) {
    super(languages, expressions);
  }
}

suite("SimpleLanguagePlugin", function() {
  suite("::getExpressionsFor", function() {
    type TestCase = {
      testIds: string[],
      languages: string[];
      expressions: Map<string, MangleExpression[]>;
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "one language",
        cases: [
          {
            testIds: ["foo"],
            languages: ["js"],
            expressions: new Map([
              ["bar", [new MangleExpressionMock("", 0, "")]],
            ]),
          },
          {
            testIds: ["foo"],
            languages: ["js"],
            expressions: new Map([
              ["foo", [new MangleExpressionMock("", 0, "")]],
              ["bar", [new MangleExpressionMock("", 1, "")]],
            ]),
          },
          {
            testIds: ["bar"],
            languages: ["js"],
            expressions: new Map([
              ["foo", [new MangleExpressionMock("", 0, "")]],
              ["bar", [new MangleExpressionMock("", 1, "")]],
            ]),
          },
        ],
      },
      {
        name: "corner cases",
        cases: [
          {
            testIds: ["foo"],
            languages: [],
            expressions: new Map([
              ["bar", [new MangleExpressionMock("", 0, "")]],
            ]),
          },
          {
            testIds: ["foo"],
            languages: ["js"],
            expressions: new Map([]),
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { testIds, languages, expressions } = testCase;
          expect(testIds).to.have.length.above(0);

          const plugin = new ConcretePlugin(languages, expressions);
          for (const testId of testIds) {
            const result = plugin.getExpressionsFor(testId);
            expect(result).to.have.lengthOf(languages.length);

            const resultLanguages = result.map((entry) => entry.language);
            expect(resultLanguages).to.deep.equal(languages);

            const expectedExpressions = expressions.get(testId) || [];
            const resultExpressions = result.map((entry) => entry.expressions);
            for (const _expressions of resultExpressions) {
              expect(_expressions).to.deep.equal(expectedExpressions);
            }
          }
        }
      });
    }
  });

  suite("::getLanguages", function() {
    const expressions = new Map();

    const scenarios: TestScenario<string[]>[] = [
      {
        name: "sample",
        cases: [
          ["foobar"],
          ["foo", "bar"],
          ["js", "cjs", "mjs"],
        ],
      },
      {
        name: "corner cases",
        cases: [
          [],
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const languages of cases) {
          const plugin = new ConcretePlugin(languages, expressions);
          const result = plugin.getLanguages();
          expect(result).to.have.lengthOf(languages.length);
          for (const language of languages) {
            expect(result).to.include(language);
          }
        }
      });
    }
  });
});
