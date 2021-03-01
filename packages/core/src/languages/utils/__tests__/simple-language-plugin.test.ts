import type { TestScenario } from "@webmangler/testing";
import type { ExpressionFactory } from "../simple-language-plugin.class";
import type { MangleExpression } from "../../../types";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import MangleExpressionMock from "../../../__mocks__/mangle-expression.mock";

import SimpleLanguagePlugin from "../simple-language-plugin.class";

chaiUse(sinonChai);

class ConcretePlugin extends SimpleLanguagePlugin {
  constructor(
    languages: string[],
    expressions: Map<string, MangleExpression[]>,
    expressionFactories: Map<string, ExpressionFactory>,
  ) {
    super(languages, expressions, expressionFactories);
  }
}

suite("SimpleLanguagePlugin", function() {
  suite("::getExpressionsFor", function() {
    const expressions = new Map();

    type TestCase = {
      testGets: { name: string, options: unknown }[],
      languages: string[];
      factories: Map<string, ExpressionFactory>;
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
          {
            testGets: [
              { name: "foo", options: { getFoo: "bar" } },
            ],
            languages: ["js"],
            factories: new Map([
              ["foo", sinon.fake()],
              ["bar", sinon.fake()],
            ]),
          },
          {
            testGets: [
              { name: "foo", options: { getFoo: "bar" } },
              { name: "bar", options: { getBar: "foo" } },
            ],
            languages: ["js", "ts"],
            factories: new Map([
              ["foo", sinon.fake()],
              ["bar", sinon.fake()],
            ]),
          },
          {
            testGets: [
              { name: "foo", options: { getFoo: "bar" } },
            ],
            languages: ["css"],
            factories: new Map([
              ["bar", sinon.fake()],
            ]),
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { testGets, languages, factories } = testCase;
          expect(testGets).to.have.length.above(0);

          const plugin = new ConcretePlugin(languages, expressions, factories);
          for (const { name, options } of testGets) {
            const result = plugin.getExpressionsFor(name, options);
            if (factories.has(name)) {
              expect(result).to.have.lengthOf(languages.length);
              result.forEach((_, language) => {
                expect(languages).to.include(language);
              });

              const factory = factories.get(name);
              expect(factory).to.have.been.calledWith(options);
            } else {
              expect(result).to.be.empty;
            }
          }
        }
      });
    }
  });

  suite("::getExpressions", function() {
    const factories = new Map();

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

          const plugin = new ConcretePlugin(languages, expressions, factories);
          for (const testId of testIds) {
            const result = plugin.getExpressions(testId);
            expect(result).to.have.lengthOf(languages.length);

            const resultLanguages: string[] = [];
            const resultExpressions: MangleExpression[][] = [];
            result.forEach((expressions, language) => {
              resultLanguages.push(language);
              resultExpressions.push(expressions);
            });
            expect(resultLanguages).to.deep.equal(languages);

            const expectedExpressions = expressions.get(testId) || [];
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
    const factories = new Map();

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
          const plugin = new ConcretePlugin(languages, expressions, factories);
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
