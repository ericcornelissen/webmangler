import { expect } from "chai";

import {
  providedOrDefault,
} from "../../inputs";

suite("Mangler input utilities", function() {
  suite("::providedOrDefault", function() {
    interface TestCase<T> {
      readonly testName: string;
      readonly testCases: Iterable<{
        readonly defaultValue: T;
        readonly providedValue: T | null | undefined;
        readonly expectedValue: T;
      }>;
    }

    const scenarios: Iterable<TestCase<unknown>> = [
      {
        testName: "provided value is nil",
        testCases: [
          {
            defaultValue: "foo",
            providedValue: null,
            expectedValue: "foo",
          },
          {
            defaultValue: "bar",
            providedValue: undefined,
            expectedValue: "bar",
          },
        ],
      },
      {
        testName: "provided value is not nil nor equal to the default value",
        testCases: [
          {
            defaultValue: "bar",
            providedValue: "foo",
            expectedValue: "foo",
          },
          {
            defaultValue: "foo",
            providedValue: "bar",
            expectedValue: "bar",
          },
        ],
      },
      {
        testName: "provided value is not nil but equal to the default value",
        testCases: [
          {
            defaultValue: "foo",
            providedValue: "foo",
            expectedValue: "foo",
          },
          {
            defaultValue: "bar",
            providedValue: "bar",
            expectedValue: "bar",
          },
        ],
      },
    ];

    for (const { testName, testCases } of scenarios) {
      test(testName, function() {
        for (const testCase of testCases) {
          const {
            defaultValue,
            providedValue,
            expectedValue,
          } = testCase;

          const result = providedOrDefault({ providedValue, defaultValue });
          expect(result).to.equal(expectedValue);
        }
      });
    }
  });
});
