import type { TestScenarios } from "@webmangler/testing";
import type { CharSet } from "@webmangler/types";

import { expect } from "chai";

import NameGenerator from "../../name-generator.class";

interface TestCase {
  charSet: CharSet;
  reserved?: string[];
  samples: {
    inc: number;
    expected: string;
  }[];
}

const ALL_LOWERCASE_CHARS = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o",
  "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
];

const ALL_NUMBER_CHARS = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
];

const ALL_UPPERCASE_CHARS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
  "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
];

suite("NameGenerator", function() {
  const reservedScenarios: TestScenarios<TestCase[]> = [
    {
      testName: "no reserved",
      getScenario: () => [
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          samples: [
            ...ALL_LOWERCASE_CHARS.map((char) => {
              return { inc: 0, expected: char };
            }),
            { inc: 0, expected: "aa" },
            { inc: 0, expected: "ab" },
            { inc: ALL_LOWERCASE_CHARS.length - 3, expected: "az" },
            { inc: 0, expected: "ba" },
          ],
        },
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          samples: [
            { inc: ALL_LOWERCASE_CHARS.length ** 2, expected: "za" },
            { inc: ALL_LOWERCASE_CHARS.length - 2, expected: "zz" },
            { inc: 0, expected: "aaa" },
            { inc: 0, expected: "aab" },
          ],
        },
        {
          charSet: [
            ...ALL_LOWERCASE_CHARS,
            ...ALL_UPPERCASE_CHARS,
          ] as CharSet,
          samples: [
            ...ALL_LOWERCASE_CHARS.map((char) => {
              return { inc: 0, expected: char };
            }),
            ...ALL_UPPERCASE_CHARS.map((char) => {
              return { inc: 0, expected: char };
            }),
            { inc: 0, expected: "aa" },
            { inc: ALL_LOWERCASE_CHARS.length - 1, expected: "aA" },
            { inc: 0, expected: "aB" },
            { inc: ALL_UPPERCASE_CHARS.length - 2, expected: "ba" },
            { inc: ALL_LOWERCASE_CHARS.length - 1, expected: "bA" },
          ],
        },
        {
          charSet: [
            ...ALL_LOWERCASE_CHARS,
            ...ALL_NUMBER_CHARS,
          ] as CharSet,
          samples: [
            ...ALL_LOWERCASE_CHARS.map((char) => {
              return { inc: 0, expected: char };
            }),
            ...ALL_NUMBER_CHARS.map((char) => {
              return { inc: 0, expected: char };
            }),
            { inc: 0, expected: "aa" },
            { inc: ALL_LOWERCASE_CHARS.length - 1, expected: "a0" },
            { inc: 1, expected: "a2" },
            { inc: ALL_NUMBER_CHARS.length - 3, expected: "ba" },
            { inc: ALL_LOWERCASE_CHARS.length - 1, expected: "b0" },
          ],
        },
      ],
    },
    {
      testName: "reserved strings",
      getScenario: () => [
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          reserved: ["a"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: ALL_LOWERCASE_CHARS.length - 2, expected: "aa" },
          ],
        },
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          reserved: ["a", "b", "ab"],
          samples: [
            { inc: 0, expected: "c" },
            { inc: ALL_LOWERCASE_CHARS.length - 3, expected: "aa" },
            { inc: 0, expected: "ac" },
          ],
        },
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          reserved: ["a"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: ALL_LOWERCASE_CHARS.length - 2, expected: "aa" },
          ],
        },
        {
          charSet: ALL_UPPERCASE_CHARS as CharSet,
          reserved: ["B"],
          samples: [
            { inc: 1, expected: "C" },
            { inc: ALL_UPPERCASE_CHARS.length - 2, expected: "AB" },
          ],
        },
        {
          charSet: ALL_NUMBER_CHARS as CharSet,
          reserved: ["3", "1", "4"],
          samples: [
            { inc: 2, expected: "5" },
            { inc: ALL_NUMBER_CHARS.length - 5, expected: "01" },
          ],
        },
      ],
    },
    {
      testName: "reserved patterns",
      getScenario: () => [
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          reserved: ["a.*"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: ALL_LOWERCASE_CHARS.length - 2, expected: "ba" },
          ],
        },
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          reserved: [".*b"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 0, expected: "c" },
            { inc: ALL_LOWERCASE_CHARS.length - 3, expected: "aa" },
            { inc: 0, expected: "ac" },
          ],
        },
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          reserved: ["a.", ".c"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 0, expected: "b" },
            { inc: 0, expected: "c" },
            { inc: ALL_LOWERCASE_CHARS.length - 3, expected: "ba" },
            { inc: 1, expected: "bd" },
          ],
        },
        {
          charSet: ALL_NUMBER_CHARS as CharSet,
          reserved: ["0.*"],
          samples: [
            { inc: 0, expected: "1" },
            { inc: ALL_NUMBER_CHARS.length - 2, expected: "10" },
          ],
        },
        {
          charSet: ALL_UPPERCASE_CHARS as CharSet,
          reserved: [".*B.*"],
          samples: [
            { inc: 1, expected: "C" },
            { inc: ALL_UPPERCASE_CHARS.length - 2, expected: "AC" },
            { inc: ALL_UPPERCASE_CHARS.length - 3, expected: "CA" },
          ],
        },
        {
          charSet: [
            ...ALL_LOWERCASE_CHARS,
            ...ALL_UPPERCASE_CHARS,
          ] as CharSet,
          reserved: ["[b-d]", "[D-G]"],
          samples: [
            { inc: 1, expected: "e" },
            { inc: ALL_LOWERCASE_CHARS.length - 3, expected: "C" },
            { inc: 0, expected: "H" },
          ],
        },
      ],
    },
    {
      testName: "reserved strings & patterns",
      getScenario: () => [
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          reserved: ["a.*", "c"],
          samples: [
            { inc: 0, expected: "b" },
            { inc: 0, expected: "d" },
            { inc: ALL_LOWERCASE_CHARS.length - 4, expected: "ba" },
            { inc: 1, expected: "bc" },
          ],
        },
        {
          charSet: ALL_LOWERCASE_CHARS as CharSet,
          reserved: ["c", ".+b"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 0, expected: "b" },
            { inc: ALL_LOWERCASE_CHARS.length - 3, expected: "aa" },
            { inc: 0, expected: "ac" },
            { inc: ALL_LOWERCASE_CHARS.length - 2, expected: "bc" },
          ],
        },
        {
          charSet: ALL_NUMBER_CHARS as CharSet,
          reserved: ["0.*", "2"],
          samples: [
            { inc: 0, expected: "1" },
            { inc: 0, expected: "3" },
            { inc: ALL_NUMBER_CHARS.length - 4, expected: "10" },
          ],
        },
        {
          charSet: ALL_UPPERCASE_CHARS as CharSet,
          reserved: ["E", ".*B.*"],
          samples: [
            { inc: 1, expected: "C" },
            { inc: 1, expected: "F" },
            { inc: ALL_UPPERCASE_CHARS.length - 5, expected: "AC" },
            { inc: ALL_UPPERCASE_CHARS.length - 3, expected: "CA" },
          ],
        },
      ],
    },
    {
      testName: "duplicate characters",
      getScenario: () => [
        {
          charSet: ["a", "b", "c", "a"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 2, expected: "aa" },
          ],
        },
        {
          charSet: ["a", "b", "c", "b"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 2, expected: "aa" },
          ],
        },
        {
          charSet: ["a", "b", "c", "c"],
          samples: [
            { inc: 0, expected: "a" },
            { inc: 2, expected: "aa" },
          ],
        },
      ],
    },
  ];

  for (const { getScenario, testName } of reservedScenarios) {
    test(testName, function() {
      for (const testCase of getScenario()) {
        const { charSet, reserved, samples } = testCase;
        expect(charSet).to.have.length.above(3);

        const g = new NameGenerator({
          reservedNames: reserved,
          charSet,
        });

        for (const { inc, expected } of samples) {
          for (let i = 0; i < inc; i += 1) {
            g.nextName();
          }

          expect(g.nextName()).to.equal(expected);
        }
      }
    });
  }

  test("empty character set", function() {
    expect(() => {
      new NameGenerator({ charSet: [] });
    }).to.throw("character set cannot be empty");
  });
});
