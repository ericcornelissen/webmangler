import type { TestScenario } from "@webmangler/testing";
import type { WebManglerEmbed } from "@webmangler/types";

import type {
  EmbedsGetter,
  ExpressionFactory,
} from "../../simple-language-plugin.class";

import { expect, use as chaiUse } from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

import SimpleLanguagePlugin from "../../simple-language-plugin.class";

chaiUse(sinonChai);

class ConcreteSimpleLanguagePlugin extends SimpleLanguagePlugin {
  constructor(
    languages: string[],
    expressionFactories: Map<string, ExpressionFactory>,
    embedsGetters?: Iterable<EmbedsGetter>,
  ) {
    super(languages, expressionFactories, embedsGetters);
  }
}

suite("SimpleLanguagePlugin", function() {
  suite("::getEmbeds", function() {
    type TestCase = {
      languages: string[];
      embedsGetters: EmbedsGetter[],
      expectedEmbeds: WebManglerEmbed[],
    };

    const embed1: WebManglerEmbed = {
      content: ".foobar { color: red; }",
      type: "css",
      startIndex: 3,
      endIndex: 14,
      getRaw(): string {
        return "color: red;";
      },
    };
    const embed2: WebManglerEmbed = {
      content: "var x = document.getElementById(\"bar\");",
      type: "js",
      startIndex: 36,
      endIndex: 77,
      getRaw(): string {
        return "var x = document.getElementById(\"bar\");";
      },
    };
    const embed3: WebManglerEmbed = {
      content: "let foo = document.querySelector(\".bar\");",
      type: "js",
      startIndex: 42,
      endIndex: 85,
      getRaw(): string {
        return "let foo = document.querySelector(\".bar\");";
      },
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
          {
            languages: ["html"],
            embedsGetters: [
              sinon.stub().returns([embed1]),
            ],
            expectedEmbeds: [embed1],
          },
          {
            languages: ["html"],
            embedsGetters: [
              sinon.stub().returns([embed1]),
              sinon.stub().returns([embed2]),
            ],
            expectedEmbeds: [embed1, embed2],
          },
          {
            languages: ["html", "xhtml"],
            embedsGetters: [
              sinon.stub().returns([embed3]),
            ],
            expectedEmbeds: [embed3],
          },
        ],
      },
      {
        name: "edge cases",
        cases: [
          {
            languages: ["css"],
            embedsGetters: [],
            expectedEmbeds: [],
          },
          {
            languages: [],
            embedsGetters: [
              sinon.stub().returns([]),
            ],
            expectedEmbeds: [],
          },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { embedsGetters, expectedEmbeds, languages } = testCase;
          const plugin = new ConcreteSimpleLanguagePlugin(
            languages,
            new Map(),
            embedsGetters,
          );

          const unsupportedFile = { content: "", type: "not a language" };
          const noEmbeds = plugin.getEmbeds(unsupportedFile);
          expect(noEmbeds).to.have.length(0);

          for (const [i, language] of languages.entries()) {
            const file = { content: "", type: language };
            const embeds = plugin.getEmbeds(file);
            expect(embeds).to.deep.equal(expectedEmbeds);

            for (const embedsGetter of embedsGetters) {
              expect(embedsGetter).to.have.callCount(i + 1);
            }
          }
        }
      });
    }
  });

  suite("::getExpressions", function() {
    type TestCase = {
      testGets: { expressionSetName: string, options: unknown }[],
      languages: string[];
      factories: Map<string, ExpressionFactory>;
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "sample",
        cases: [
          {
            testGets: [
              { expressionSetName: "foo", options: { getFoo: "bar" } },
            ],
            languages: ["js"],
            factories: new Map([
              ["foo", sinon.fake()],
              ["bar", sinon.fake()],
            ]),
          },
          {
            testGets: [
              { expressionSetName: "foo", options: { getFoo: "bar" } },
              { expressionSetName: "bar", options: { getBar: "foo" } },
            ],
            languages: ["js", "ts"],
            factories: new Map([
              ["foo", sinon.fake()],
              ["bar", sinon.fake()],
            ]),
          },
          {
            testGets: [
              { expressionSetName: "foo", options: { getFoo: "bar" } },
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
          for (const { expressionSetName, options } of testGets) {
            const result = plugin.getExpressions(expressionSetName, options);
            if (factories.has(expressionSetName)) {
              expect(result).to.have.lengthOf(languages.length);
              result.forEach((_, language) => {
                expect(languages).to.include(language);
              });

              const factory = factories.get(expressionSetName);
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
