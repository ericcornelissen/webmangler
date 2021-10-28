import type { CharSet } from "@webmangler/types";

import { expect } from "chai";

import {
  getMangleMap,
} from "../../mangle";

suite("ManglerEngine mangle", function() {
  suite("::getMangleMap", function() {
    interface TestScenario {
      readonly testName: string;
      readonly getTestCases: () => Iterable<{
        readonly instances: Map<string, number>;
        readonly manglePrefix: string;
        readonly reservedNames: Iterable<string>;
        readonly charSet: CharSet;
        readonly expected: Map<string, string>;
      }>;
    }

    const scenarios: Iterable<TestScenario> = [
      {
        testName: "empty input map",
        getTestCases: () => [
          {
            instances: new Map(),
            manglePrefix: "",
            reservedNames: [],
            charSet: ["a", "b", "c"],
            expected: new Map(),
          },
          {
            instances: new Map(),
            manglePrefix: "foobar",
            reservedNames: [],
            charSet: ["a", "b", "c"],
            expected: new Map(),
          },
          {
            instances: new Map(),
            manglePrefix: "",
            reservedNames: ["foobar"],
            charSet: ["a", "b", "c"],
            expected: new Map(),
          },
        ],
      },
      {
        testName: "no reserved nor prefix",
        getTestCases: () => [
          {
            instances: new Map([
              ["foobar", 1],
            ]),
            manglePrefix: "",
            reservedNames: [],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["foobar", "a"],
            ]),
          },
          {
            instances: new Map([
              ["foo", 2],
              ["bar", 1],
            ]),
            manglePrefix: "",
            reservedNames: [],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["foo", "a"],
              ["bar", "b"],
            ]),
          },
          {
            instances: new Map([
              ["foo", 1],
              ["bar", 2],
            ]),
            manglePrefix: "",
            reservedNames: [],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["foo", "b"],
              ["bar", "a"],
            ]),
          },
          {
            instances: new Map([
              ["praise", 1],
              ["the", 3],
              ["sun", 2],
            ]),
            manglePrefix: "",
            reservedNames: [],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["praise", "c"],
              ["the", "a"],
              ["sun", "b"],
            ]),
          },
        ],
      },
      {
        testName: "with reserved no prefix",
        getTestCases: () => [
          {
            instances: new Map([
              ["foobar", 1],
            ]),
            manglePrefix: "",
            reservedNames: ["a"],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["foobar", "b"],
            ]),
          },
          {
            instances: new Map([
              ["foo", 2],
              ["bar", 1],
            ]),
            manglePrefix: "",
            reservedNames: ["b"],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["foo", "a"],
              ["bar", "c"],
            ]),
          },
          {
            instances: new Map([
              ["foo", 1],
              ["bar", 2],
            ]),
            manglePrefix: "",
            reservedNames: ["b"],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["foo", "c"],
              ["bar", "a"],
            ]),
          },
          {
            instances: new Map([
              ["praise", 1],
              ["the", 3],
              ["sun", 2],
            ]),
            manglePrefix: "",
            reservedNames: ["a", "aa"],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["praise", "ab"],
              ["the", "b"],
              ["sun", "c"],
            ]),
          },
          {
            instances: new Map([
              ["praise", 1],
              ["the", 3],
              ["sun", 2],
            ]),
            manglePrefix: "",
            reservedNames: ["^[a-z]$"],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["praise", "ac"],
              ["the", "aa"],
              ["sun", "ab"],
            ]),
          },
        ],
      },
      {
        testName: "no reserved with prefix",
        getTestCases: () => [
          {
            instances: new Map([
              ["foobar", 1],
            ]),
            manglePrefix: "foo-",
            reservedNames: [],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["foobar", "foo-a"],
            ]),
          },
          {
            instances: new Map([
              ["foo", 2],
              ["bar", 1],
            ]),
            manglePrefix: "x-",
            reservedNames: [],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["foo", "x-a"],
              ["bar", "x-b"],
            ]),
          },
          {
            instances: new Map([
              ["foo", 1],
              ["bar", 2],
            ]),
            manglePrefix: "x-",
            reservedNames: [],
            charSet: ["a", "b", "c"],
            expected: new Map([
              ["foo", "x-b"],
              ["bar", "x-a"],
            ]),
          },
        ],
      },
    ];

    for (const { testName, getTestCases } of scenarios) {
      test(testName, function() {
        for (const testCase of getTestCases()) {
          const {
            instances,
            manglePrefix,
            reservedNames,
            charSet,
            expected,
          } = testCase;

          const result = getMangleMap(
            instances,
            manglePrefix,
            reservedNames,
            charSet,
          );
          expect(result).to.deep.equal(expected);
        }
      });
    }
  });
});
