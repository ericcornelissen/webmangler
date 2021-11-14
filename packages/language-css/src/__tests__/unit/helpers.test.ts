import { expect } from "chai";

import {
  getExpressionFactories,
  getLanguages,
} from "../../helpers";

suite("CSS language plugin helpers", function() {
  suite("::getExpressionFactories", function() {
    let subject: ReturnType<typeof getExpressionFactories>;

    suiteSetup(function() {
      subject = getExpressionFactories();
    });

    test("css-declaration-properties", function() {
      const result = subject.get("css-declaration-properties");
      expect(result).not.to.be.undefined;
    });

    test("css-declaration-values", function() {
      const result = subject.get("css-declaration-values");
      expect(result).not.to.be.undefined;
    });

    test("query-selectors", function() {
      const result = subject.get("query-selectors");
      expect(result).not.to.be.undefined;
    });

    test("single-value-attributes", function() {
      const result = subject.get("single-value-attributes");
      expect(result).not.to.be.undefined;
    });
  });

  suite("::getLanguages", function() {
    const DEFAULT_LANGUAGES: Iterable<string> = [
      "css",
    ];

    interface TestScenario {
      readonly testName: string;
      getScenario(): {
        configuredLanguages: Iterable<string> | undefined;
        expectedLanguages: Iterable<string>;
      };
    }

    const scenarios: TestScenario[] = [
      {
        testName: "without configured languages",
        getScenario: () => ({
          configuredLanguages: undefined,
          expectedLanguages: [
            ...DEFAULT_LANGUAGES,
          ],
        }),
      },
      {
        testName: "with zero configured languages",
        getScenario: () => ({
          configuredLanguages: [],
          expectedLanguages: [
            ...DEFAULT_LANGUAGES,
          ],
        }),
      },
      {
        testName: "with one configured language",
        getScenario: () => {
          const configuredLanguage = "style";

          return {
            configuredLanguages: [configuredLanguage],
            expectedLanguages: [
              ...DEFAULT_LANGUAGES,
              configuredLanguage,
            ],
          };
        },
      },
      {
        testName: "with configured languages",
        getScenario: () => {
          const configuredLanguages = [
            "scss",
            "less",
          ];

          return {
            configuredLanguages,
            expectedLanguages: [
              ...DEFAULT_LANGUAGES,
              ...configuredLanguages,
            ],
          };
        },
      },
      {
        testName: "configured languages equal default languages",
        getScenario: () => ({
          configuredLanguages: [
            ...DEFAULT_LANGUAGES,
          ],
          expectedLanguages: [
            ...DEFAULT_LANGUAGES,
          ],
        }),
      },
      {
        testName: "configured languages includes default languages",
        getScenario: () => {
          const configuredLanguages = [
            "scss",
            ...DEFAULT_LANGUAGES,
            "less",
          ];

          return {
            configuredLanguages,
            expectedLanguages: new Set([
              ...DEFAULT_LANGUAGES,
              ...configuredLanguages,
            ]),
          };
        },
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        const {
          configuredLanguages,
          expectedLanguages,
        } = getScenario();

        const expectedLength = Array.from(expectedLanguages).length;

        const result = getLanguages(configuredLanguages);
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
