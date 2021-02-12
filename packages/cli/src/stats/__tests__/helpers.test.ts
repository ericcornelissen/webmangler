import type { TestScenario } from "@webmangler/testing";

import { expect } from "chai";

import { getChangedPercentage } from "../helpers";

suite("Helpers", function() {
  suite("::getChangedPercentage", function() {
    type TestCase = {
      before: number,
      after: number,
      expected: number,
    };

    const scenarios: TestScenario<TestCase>[] = [
      {
        name: "percentage decrease",
        cases: [
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
        name: "percentage increase",
        cases: [
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
        name: "corner cases",
        cases: [
          { before: 10, after: 10, expected: 0 },
        ],
      },
    ];

    for (const { name, cases } of scenarios) {
      test(name, function() {
        for (const testCase of cases) {
          const { after, before, expected } = testCase;

          const result = getChangedPercentage(before, after);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
