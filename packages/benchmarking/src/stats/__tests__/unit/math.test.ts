import type { TestScenarios } from "@webmangler/testing";

import { expect } from "chai";

import {
  medianOf,
} from "../../math";

suite("Benchmarking stats maths", function() {
  suite("::medianOf", function() {
    interface TestCase {
      readonly values: ReadonlyArray<number>;
      readonly expected: number;
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "even number of numbers",
        getScenario: () => [
          {
            values: [
              2,
              4,
            ],
            expected: 3,
          },
          {
            values: [
              8,
              4,
              6,
              4,
            ],
            expected: 5,
          },
        ],
      },
      {
        testName: "uneven number of numbers",
        getScenario: () => [
          {
            values: [
              10,
              11,
              12,
            ],
            expected: 11,
          },
          {
            values: [
              10,
              17,
              21,
              9,
              14,
            ],
            expected: 14,
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const { values, expected } of getScenario()) {
          const result = medianOf(values);
          expect(result).to.equal(expected);
        }
      });
    }
  });
});
