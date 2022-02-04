import type { CharSet, MangleEngineOptions } from "@webmangler/types";

import { expect } from "chai";

import {
  parseOptions,
} from "../../options";

const ALL_LOWERCASE_CHARS: CharSet = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
  "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
];

const ALL_UPPERCASE_CHARS: CharSet = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
  "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

const ALL_CHARS: CharSet = [
  ...ALL_LOWERCASE_CHARS,
  ...ALL_UPPERCASE_CHARS,
];

suite("ManglerEngine options", function() {
  suite("::parseOptions", function() {
    interface TestScenario {
      readonly testName: string;
      readonly getTestCases: () => Iterable<{
        readonly options: MangleEngineOptions;
        readonly expected: {
          readonly patterns: Iterable<string>;
          readonly ignorePatterns: Iterable<string>;
          readonly charSet: CharSet;
          readonly manglePrefix: string;
          readonly reservedNames: Iterable<string>;
        };
      }>;
    }

    const scenarios: Iterable<TestScenario> = [
      {
        testName: "only patterns",
        getTestCases: () => [
          {
            options: {
              patterns: ["foo*", "ba+r"],
            },
            expected: {
              patterns: ["foo*", "ba+r"],
              ignorePatterns: [],
              charSet: ALL_LOWERCASE_CHARS,
              manglePrefix: "",
              reservedNames: [],
            },
          },
        ],
      },
      {
        testName: "with character set",
        getTestCases: () => [
          {
            options: {
              patterns: ["foo*", "ba+r"],
              charSet: ALL_CHARS,
            },
            expected: {
              patterns: ["foo*", "ba+r"],
              ignorePatterns: [],
              charSet: ALL_CHARS,
              manglePrefix: "",
              reservedNames: [],
            },
          },
        ],
      },
      {
        testName: "with ignore patterns",
        getTestCases: () => [
          {
            options: {
              patterns: ["foo*", "ba+r"],
              ignorePatterns: ["hello", "world"],
            },
            expected: {
              patterns: ["foo*", "ba+r"],
              ignorePatterns: ["hello", "world"],
              charSet: ALL_LOWERCASE_CHARS,
              manglePrefix: "",
              reservedNames: [],
            },
          },
        ],
      },
      {
        testName: "with reserved names",
        getTestCases: () => [
          {
            options: {
              patterns: ["foo*", "ba+r"],
              reservedNames: ["hello", "world"],
            },
            expected: {
              patterns: ["foo*", "ba+r"],
              ignorePatterns: [],
              charSet: ALL_LOWERCASE_CHARS,
              manglePrefix: "",
              reservedNames: ["hello", "world"],
            },
          },
        ],
      },
      {
        testName: "with prefix",
        getTestCases: () => [
          {
            options: {
              patterns: ["foo*", "ba+r"],
              manglePrefix: "data-",
            },
            expected: {
              patterns: ["foo*", "ba+r"],
              ignorePatterns: [],
              charSet: ALL_LOWERCASE_CHARS,
              manglePrefix: "data-",
              reservedNames: [],
            },
          },
        ],
      },
    ];

    for (const { testName, getTestCases } of scenarios) {
      test(testName, function() {
        for (const testCase of getTestCases()) {
          const { options, expected } = testCase;
          const result = parseOptions(options);
          expect(result).to.deep.equal(expected);
        }
      });
    }
  });
});
