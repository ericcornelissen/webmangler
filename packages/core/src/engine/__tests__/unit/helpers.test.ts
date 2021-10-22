import { expect } from "chai";

import {
  mapToOrderedList,
  removeIgnoredKeys,
} from "../../helpers";

suite("ManglerEngine helpers", function() {
  suite("::mapToOrderedList", function() {
    interface TestScenario {
      readonly testName: string;
      readonly getTestCases: () => Iterable<{
        readonly map: Map<string, number>,
        readonly expected: string[];
      }>;
    }

    const scenarios: Iterable<TestScenario> = [
      {
        testName: "edge cases",
        getTestCases: () => [
          {
            map: new Map(),
            expected: [],
          },
          {
            map: new Map([
              ["foobar", 1],
            ]),
            expected: [
              "foobar",
            ],
          },
        ],
      },
      {
        testName: "only patterns",
        getTestCases: () => [
          {
            map: new Map([
              ["foo", 1],
              ["bar", 2],
            ]),
            expected: [
              "bar",
              "foo",
            ],
          },
          {
            map: new Map([
              ["praise", 3],
              ["the", 7],
              ["sun", 5],
            ]),
            expected: [
              "the",
              "sun",
              "praise",
            ],
          },
          {
            map: new Map([
              ["foo", 5],
              ["hello", 13],
              ["bar", 3],
              ["world", 7],
            ]),
            expected: [
              "hello",
              "world",
              "foo",
              "bar",
            ],
          },
        ],
      },
    ];

    for (const { testName, getTestCases } of scenarios) {
      test(testName, function() {
        for (const testCase of getTestCases()) {
          const { map, expected } = testCase;
          const result = mapToOrderedList(map);
          expect(result).to.deep.equal(expected);
        }
      });
    }
  });

  suite("::removeIgnoredKeys", function() {
    interface TestScenario {
      readonly testName: string;
      readonly getTestCases: () => Iterable<{
        readonly map: Map<string, number>,
        readonly removePatterns: Iterable<string>;
        readonly expected: Map<string, number>;
      }>;
    }

    const scenarios: Iterable<TestScenario> = [
      {
        testName: "edge cases",
        getTestCases: () => [
          {
            map: new Map(),
            removePatterns: [],
            expected: new Map(),
          },
          {
            map: new Map(),
            removePatterns: ["foo", "bar"],
            expected: new Map(),
          },
        ],
      },
      {
        testName: "no remove patterns",
        getTestCases: () => [
          {
            map: new Map([
              ["foo", 3],
              ["bar", 14],
            ]),
            removePatterns: [],
            expected: new Map([
              ["foo", 3],
              ["bar", 14],
            ]),
          },
        ],
      },
      {
        testName: "with matching patterns",
        getTestCases: () => [
          {
            map: new Map([
              ["foo", 1],
              ["bar", 2],
            ]),
            removePatterns: [
              "f[a-z]+",
            ],
            expected: new Map([
              ["bar", 2],
            ]),
          },
          {
            map: new Map([
              ["foo", 1],
              ["bar", 2],
            ]),
            removePatterns: [
              "b[a-z]+",
            ],
            expected: new Map([
              ["foo", 1],
            ]),
          },
          {
            map: new Map([
              ["foo", 1],
              ["bar", 2],
            ]),
            removePatterns: [
              "f[a-z]+",
              "b[a-z]+",
            ],
            expected: new Map(),
          },
          {
            map: new Map([
              ["praise", 3],
              ["the", 1],
              ["sun", 4],
            ]),
            removePatterns: [
              ".*",
            ],
            expected: new Map(),
          },
          {
            map: new Map([
              ["praise", 3],
              ["the", 1],
              ["sun", 4],
            ]),
            removePatterns: [
              "[a-z]{4}",
            ],
            expected: new Map([
              ["the", 1],
              ["sun", 4],
            ]),
          },
        ],
      },
    ];

    for (const { testName, getTestCases } of scenarios) {
      test(testName, function() {
        for (const testCase of getTestCases()) {
          const { map, removePatterns, expected } = testCase;
          const result = removeIgnoredKeys(map, removePatterns);
          expect(result).to.deep.equal(expected);
        }
      });
    }
  });
});
