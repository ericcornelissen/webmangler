import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import {
  getChangedPercentage,
} from "../../helpers";

suite("Helpers", function() {
  suite("::getChangedPercentage", function() {
    interface TestCase {
      readonly before: number;
      readonly after: number;
      readonly expected: number;
    }

    const scenarios: TestScenarios<Iterable<TestCase>> = [
      {
        testName: "percentage decrease",
        getScenario: () => [
          { before: 10, after: 9, expected: -10 },
          { before: 10, after: 5, expected: -50 },
          { before: 10, after: 1, expected: -90 },
          { before: 100, after: 99, expected: -1 },
          { before: 1000, after: 999, expected: -0.1 },
          { before: 10000, after: 9999, expected: -0.01 },
          { before: 100000, after: 99999, expected: -0.001 },
        ],
      },
      {
        testName: "percentage increase",
        getScenario: () => [
          { before: 10, after: 11, expected: 10 },
          { before: 10, after: 15, expected: 50 },
          { before: 100, after: 101, expected: 1 },
          { before: 1000, after: 1001, expected: 0.1 },
          { before: 10000, after: 10001, expected: 0.01 },
          { before: 100000, after: 100001, expected: 0.001 },
          { before: 10, after: 20, expected: 100 },
          { before: 10, after: 30, expected: 200 },
        ],
      },
      {
        testName: "corner cases",
        getScenario: () => [
          { before: 10, after: 10, expected: 0 },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const { after, before, expected } = testCase;

          const result = getChangedPercentage(before, after);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
