import type { BenchmarkRunStats } from "../types";

import { expect } from "chai";

import { computeStats } from "../stats";

suite("Benchmarking stats", function() {
  suite("::computeStats", function() {
    type TestCase = {
      readonly runs: BenchmarkRunStats[];
      readonly expected: number;
    }

    test("median duration", function() {
      const testCases: TestCase[] = [
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
        {
          runs: [
            { duration: 8 },
            { duration: 4 },
            { duration: 6 },
            { duration: 4 },
          ],
          expected: 5,
        },
      ];

      for (const testCase of testCases) {
        const result = computeStats(testCase.runs);
        expect(result.medianDuration).to.equal(testCase.expected);
      }
    });
  });
});
