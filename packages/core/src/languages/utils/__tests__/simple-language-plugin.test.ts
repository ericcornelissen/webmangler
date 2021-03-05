import type { TestScenario } from "@webmangler/testing";
import type { ExpressionFactory } from "../simple-language-plugin.class";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import SimpleLanguagePlugin from "../simple-language-plugin.class";

chaiUse(sinonChai);

class ConcreteSimpleLanguagePlugin extends SimpleLanguagePlugin {
  constructor(
    languages: string[],
    expressionFactories: Map<string, ExpressionFactory>,
  ) {
    super(languages, expressionFactories);
  }
}

suite("SimpleLanguagePlugin", function() {
  suite("::getExpressionsFor", function() {
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

          const plugin = new ConcreteSimpleLanguagePlugin(languages, factories);
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

  suite("::getLanguages", function() {
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
          const plugin = new ConcreteSimpleLanguagePlugin(languages, factories);
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
