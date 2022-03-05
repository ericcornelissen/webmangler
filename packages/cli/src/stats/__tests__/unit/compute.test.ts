import type { TestScenarios } from "@webmangler/testing";
import type { WebManglerCliFile } from "../../../fs";
import type { FileStats } from "../../types";

import { expect } from "chai";

import WebManglerCliFileMock from "../common/file.mock";

import {
  computeStats,
} from "../../compute";

suite("Compute stats", function() {
  suite("::computeStats", function() {
    interface TestCase {
      readonly input: {
        readonly duration: number;
        readonly inFiles: WebManglerCliFile[];
        readonly outFiles: WebManglerCliFile[];
      };
      readonly expected: {
        readonly filePath: string;
        readonly changed: boolean;
        readonly sizeBefore?: number;
        readonly sizeAfter?: number;
      }[];
      readonly expectedAggregate: {
        readonly changed: boolean;
        readonly sizeBefore?: number;
        readonly sizeAfter?: number;
      };
    }

    const scenarios: TestScenarios<Iterable<TestCase>> = [
      {
        testName: "sample",
        getScenario: () => [
          {
            input: {
              duration: 1,
              inFiles: [
                new WebManglerCliFileMock({
                  path: "foo.bar",
                  originalSize: 3,
                }),
              ],
              outFiles: [
                new WebManglerCliFileMock({
                  path: "foo.bar",
                  size: 2,
                }),
              ],
            },
            expected: [
              {
                filePath: "foo.bar",
                changed: true,
                sizeBefore: 3,
                sizeAfter: 2,
              },
            ],
            expectedAggregate: {
              changed: true,
              sizeBefore: 3,
              sizeAfter: 2,
            },
          },
          {
            input: {
              duration: 2,
              inFiles: [
                new WebManglerCliFileMock({
                  path: "foo.bar",
                  originalSize: 3,
                }),
              ],
              outFiles: [],
            },
            expected: [
              {
                filePath: "foo.bar",
                changed: false,
              },
            ],
            expectedAggregate: {
              changed: false,
            },
          },
          {
            input: {
              duration: 2,
              inFiles: [
                new WebManglerCliFileMock({
                  path: "foo.bar",
                  originalSize: 3,
                }),
                new WebManglerCliFileMock({
                  path: "foo.baz",
                  originalSize: 3,
                }),
              ],
              outFiles: [
                new WebManglerCliFileMock({
                  path: "foo.bar",
                  size: 2,
                }),
              ],
            },
            expected: [
              {
                filePath: "foo.bar",
                changed: true,
                sizeBefore: 3,
                sizeAfter: 2,
              },
              {
                filePath: "foo.baz",
                changed: false,
              },
            ],
            expectedAggregate: {
              changed: true,
              sizeBefore: 6,
              sizeAfter: 5,
            },
          },
        ],
      },
      {
        testName: "corner cases",
        getScenario: () => [
          {
            input: {
              duration: 0,
              inFiles: [],
              outFiles: [],
            },
            expected: [],
            expectedAggregate: {
              changed: false,
            },
          },
        ],
      },
    ];

    for (const { getScenario, testName } of scenarios) {
      test(testName, function() {
        for (const testCase of getScenario()) {
          const { input, expected, expectedAggregate } = testCase;
          const { duration, inFiles, outFiles } = input;

          const stats = computeStats({
            duration,
            inFiles,
            outFiles,
          });

          expect(stats.duration).to.equal(duration);
          expect(stats.files.size).to.equal(expected.length);

          for (const expectedI of expected) {
            const {
              filePath,
              changed,
              sizeBefore,
              sizeAfter,
            } = expectedI;

            const fileStats = stats.files.get(filePath) as FileStats;
            expect(fileStats).not.to.be.undefined;
            expect(fileStats.changed).to.equal(changed);

            if (changed) {
              expect(fileStats.changePercentage).not.to.equal(0);
              expect(fileStats.sizeBefore).to.equal(sizeBefore);
              expect(fileStats.sizeAfter).to.equal(sizeAfter);
            }
          }

          const aggregate = stats.aggregate;
          expect(aggregate.changed).to.equal(expectedAggregate.changed);
          if (aggregate.changed) {
            expect(aggregate.changePercentage).not.to.equal(0);
            expect(aggregate.sizeBefore).to.equal(expectedAggregate.sizeBefore);
            expect(aggregate.sizeAfter).to.equal(expectedAggregate.sizeAfter);
          }
        }
      });
    }
  });
});
