import type { TestScenarios } from "@webmangler/testing";

import type { BenchmarkRunStats } from "../../types";

import { expect } from "chai";

import { computeStats } from "../../index";

suite("Benchmarking stats", function() {
  suite("::computeStats", function() {
    interface TestCase {
      readonly runs: BenchmarkRunStats[];
      readonly expected: number;
    }

    const scenarios: TestScenarios<TestCase[]> = [
      {
        testName: "even number of runs",
        getScenario: () => ([
          {
            runs: [
              { duration: 8 },
              { duration: 4 },
              { duration: 6 },
              { duration: 4 },
            ],
            expected: 5,
          },
        ]),
      },
      {
        testName: "uneven number of runs",
        getScenario: () => ([
          {
            runs: [
              { duration: 10 },
              { duration: 11 },
              { duration: 12 },
            ],
            expected: 11,
          },
          {
            runs: [
              { duration: 10 },
              { duration: 17 },
              { duration: 21 },
              { duration: 9 },
              { duration: 14 },
            ],
            expected: 14,
          },
        ]),
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(`median duration, ${testName}`, function() {
        for (const { runs, expected } of getScenario()) {
          const result = computeStats(runs);
          expect(result.medianDuration).to.equal(expected);
        }
      });
    }
  });
});
