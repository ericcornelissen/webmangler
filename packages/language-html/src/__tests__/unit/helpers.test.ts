import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import {
  getEmbedFinders,
  getExpressionFactories,
  getLanguages,
} from "../../helpers";

suite("HTML language plugin helpers", function() {
  suite("::getEmbedFinders", function() {
    let subject: ReturnType<typeof getEmbedFinders>;

    suiteSetup(function() {
      subject = getEmbedFinders();
    });

    test("at least two (CSS and JS)", function() {
      const length = Array.from(subject).length;
      expect(length).to.be.at.least(2);
    });
  });

  suite("::getExpressionFactories", function() {
    let subject: ReturnType<typeof getExpressionFactories>;

    suiteSetup(function() {
      subject = getExpressionFactories();
    });

    test("attributes", function() {
      const result = subject.get("attributes");
      expect(result).not.to.be.undefined;
    });

    test("multi-value-attributes", function() {
      const result = subject.get("multi-value-attributes");
      expect(result).not.to.be.undefined;
    });

    test("single-value-attributes", function() {
      const result = subject.get("single-value-attributes");
      expect(result).not.to.be.undefined;
    });
  });

  suite("::getLanguages", function() {
    const DEFAULT_LANGUAGES: Iterable<string> = [
      "html",
      "xhtml",
    ];

    interface TestCase {
      readonly options: {
        readonly htmlExtensions: Iterable<string> | undefined;
      };
      readonly expectedLanguages: Iterable<string>;
    }

    const scenarios: TestScenarios<TestCase> = [
      {
        testName: "without configured languages",
        getScenario: () => ({
          options: {
            htmlExtensions: undefined,
          },
          expectedLanguages: [
            ...DEFAULT_LANGUAGES,
          ],
        }),
      },
      {
        testName: "with zero configured languages",
        getScenario: () => ({
          options: {
            htmlExtensions: [],
          },
          expectedLanguages: [
            ...DEFAULT_LANGUAGES,
          ],
        }),
      },
      {
        testName: "with one configured language",
        getScenario: () => {
          const htmlExtensions = [
            "html5",
          ];

          return {
            options: {
              htmlExtensions,
            },
            expectedLanguages: [
              ...DEFAULT_LANGUAGES,
              ...htmlExtensions,
            ],
          };
        },
      },
      {
        testName: "with configured languages",
        getScenario: () => {
          const htmlExtensions = [
            "html4",
            "html5",
          ];

          return {
            options: {
              htmlExtensions,
            },
            expectedLanguages: [
              ...DEFAULT_LANGUAGES,
              ...htmlExtensions,
            ],
          };
        },
      },
      {
        testName: "configured languages equal default languages",
        getScenario: () => ({
          options: {
            htmlExtensions: DEFAULT_LANGUAGES,
          },
          expectedLanguages: [
            ...DEFAULT_LANGUAGES,
          ],
        }),
      },
      {
        testName: "configured languages includes default languages",
        getScenario: () => {
          const htmlExtensions = [
            "html4",
            ...DEFAULT_LANGUAGES,
            "html5",
          ];

          return {
            options: {
              htmlExtensions,
            },
            expectedLanguages: new Set([
              ...DEFAULT_LANGUAGES,
              ...htmlExtensions,
            ]),
          };
        },
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        const {
          options,
          expectedLanguages,
        } = getScenario();

        const expectedLength = Array.from(expectedLanguages).length;

        const result = getLanguages(options);
        const resultAsArray = Array.from(result);

        expect(resultAsArray).to.have.lengthOf(expectedLength);
        for (const language of expectedLanguages) {
          const isLanguageInResult = resultAsArray.includes(language);
          expect(isLanguageInResult).to.be.true;
        }
      });
    }
  });
});
