import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import {
  getExpressionFactories,
  getLanguages,
} from "../../helpers";

suite("JavaScript language plugin helpers", function() {
  suite("::getExpressionFactories", function() {
    let subject: ReturnType<typeof getExpressionFactories>;

    suiteSetup(function() {
      subject = getExpressionFactories();
    });

    test("css-declaration-properties", function() {
      const result = subject.get("css-declaration-properties");
      expect(result).not.to.be.undefined;
    });

    test("query-selectors", function() {
      const result = subject.get("query-selectors");
      expect(result).not.to.be.undefined;
    });
  });

  suite("::getLanguages", function() {
    const DEFAULT_LANGUAGES: Iterable<string> = [
      "js",
      "cjs",
      "mjs",
    ];

    interface TestCase {
      options: {
        jsExtensions: Iterable<string> | undefined;
      };
      expectedLanguages: Iterable<string>;
    }

    const scenarios: TestScenarios<TestCase> = [
      {
        testName: "without configured languages",
        getScenario: () => ({
          options: {
            jsExtensions: undefined,
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
            jsExtensions: [],
          },
          expectedLanguages: [
            ...DEFAULT_LANGUAGES,
          ],
        }),
      },
      {
        testName: "with one configured language",
        getScenario: () => {
          const jsExtensions = [
            "javascript",
          ];

          return {
            options: {
              jsExtensions,
            },
            expectedLanguages: [
              ...DEFAULT_LANGUAGES,
              ...jsExtensions,
            ],
          };
        },
      },
      {
        testName: "with configured languages",
        getScenario: () => {
          const jsExtensions = [
            "jsx",
            "ts",
          ];

          return {
            options: {
              jsExtensions,
            },
            expectedLanguages: [
              ...DEFAULT_LANGUAGES,
              ...jsExtensions,
            ],
          };
        },
      },
      {
        testName: "configured languages equal default languages",
        getScenario: () => ({
          options: {
            jsExtensions: DEFAULT_LANGUAGES,
          },
          expectedLanguages: [
            ...DEFAULT_LANGUAGES,
          ],
        }),
      },
      {
        testName: "configured languages includes default languages",
        getScenario: () => {
          const jsExtensions = [
            "jsx",
            ...DEFAULT_LANGUAGES,
            "ts",
          ];

          return {
            options: {
              jsExtensions,
            },
            expectedLanguages: new Set([
              ...DEFAULT_LANGUAGES,
              ...jsExtensions,
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
